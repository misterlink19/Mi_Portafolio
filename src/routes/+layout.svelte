<!-- src/routes/+layout.svelte -->
<script lang="ts">
	/**
	 * Layout raíz de tu portafolio
	 *
	 * - Carga estilos globales (Tailwind, reset…).
	 * - Gestiona tema claro/oscuro a nivel <html>.
	 * - Controla animación de cambio de página.
	 * - Prerenderiza todas las rutas multilingües usando Paraglide.
	 */

	// 1) Estilos globales
	import '../app.css';

	// 2) Utilidades de Svelte
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	// 3) Stores personalizados
	import { theme } from '$lib/stores/theme';
	import { pageTransition } from '$lib/stores/animations';

	// 4) Paraglide runtime
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	// 5) Componentes comunes
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';

	// 6) Reactividad: forzamos key al cambiar de ruta
	$: currentPath = $page.url.pathname;

	// Esta función es CRUCIAL para pasar el 'lang' del servidor al cliente.
	export async function load({ locals }) {
		const lang = (locals as any).paraglide?.lang || 'es'; // Asegura que 'lang' se extraiga correctamente
		return {
			paraglide: {
				lang: lang as (typeof locales)[number] // Tipado para SvelteKit
			}
		};
	}

	onMount(() => {
		const unsubTheme = theme.subscribe((v) => {
			console.log(
				'Tema actualizado a:',
				v,
				'HTML classList.contains("dark"):',
				document.documentElement.classList.contains('dark')
			);
		});

		// —> Detecta cuando cambiamos de ruta y dispara `pageTransition`
		const unsubPage = page.subscribe(($p) => {
			if (currentPath && currentPath !== $p.url.pathname) {
				pageTransition.set(true); // marca “saliendo…”
				setTimeout(() => pageTransition.set(false), 100);
			}
		});

		// Cleanup: Desuscribirse para evitar fugas de memoria
		return () => {
			unsubTheme();
			unsubPage();
		};
	});
</script>

<!--
 Estructura del layout:
 ┌─────────────────────────────────────────┐
 │ Header (navegación + idioma + tema)     │
 ├─────────────────────────────────────────┤
 │ Main (slot animado al cambiar de ruta)  │
 ├─────────────────────────────────────────┤
 │ Footer + ScrollToTop                    │
 └─────────────────────────────────────────┘
-->
<!-- Aplica clases de fondo y texto al contenedor principal del layout para asegurar que todo responda al tema -->
<div class="min-h-screen flex flex-col">
	<Header />

	<main class="flex-1 pt-20">
		{#key currentPath}
			<div transition:fly={{ y: 30, duration: 500, easing: quintOut }}>
				<slot />
			</div>
		{/key}
	</main>

	<Footer />
	<ScrollToTop />
</div>

<!--
 Prerender multilingüe: aunque esté oculto,
 SvelteKit “crawleará” todos los enlaces localizados para SEO.
-->
<div style="display: none" aria-hidden="true">
	{#each locales as loc}
		<a href={localizeHref($page.url.pathname, { locale: loc })}>{loc}</a>
	{/each}
</div>

<style global>
	/* Transición suave al alternar tema para los elementos que usan colores de Tailwind */
	html {
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}
</style>
