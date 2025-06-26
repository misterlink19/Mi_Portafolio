<!-- src/routes/+layout.svelte -->
<script lang="ts">	/**
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
	import { page } from '$app/stores'; // Observa URL para animaciones
	import { fly } from 'svelte/transition'; // Animación de entrada/salida
	import { quintOut } from 'svelte/easing'; // Easing para fly

	// 3) Stores personalizados
	import { theme } from '$lib/stores/theme'; // Tema claro/oscuro
	import { pageTransition } from '$lib/stores/animations'; // Flag tipo “saliendo”/“entrando”

	// 4) Paraglide runtime
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	// locales: ['en','es',…]
	// localizeHref: construye URL con prefijo

	// 5) Componentes comunes
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ScrollToTop from '$lib/components/ScrollToTop.svelte';

	// 6) Reactividad: forzamos key al cambiar de ruta
	$: currentPath = $page.url.pathname;

	onMount(() => {
		// —> Aplica la clase `dark` inicial y en futuros cambios
		document.documentElement.classList.toggle('dark', $theme === 'dark');
		const unsubTheme = theme.subscribe((v) =>
			document.documentElement.classList.toggle('dark', v === 'dark')
		);

		// —> Detecta cuando cambiamos de ruta y dispara `pageTransition`
		const unsubPage = page.subscribe(($p) => {
			if (currentPath && currentPath !== $p.url.pathname) {
				pageTransition.set(true); // marca “saliendo…”
				setTimeout(() => pageTransition.set(false), 100);
			}
		});

		// Cleanup
		return () => {
			unsubTheme();
			unsubPage();
		};
	});
</script>

<!--
  Estructura del layout:
  ┌─────────────────────────────────────────┐
  │ Header (navegación + idioma + tema)    │
  ├─────────────────────────────────────────┤
  │ Main (slot animado al cambiar de ruta) │
  ├─────────────────────────────────────────┤
  │ Footer + ScrollToTop                   │
  └─────────────────────────────────────────┘
-->
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
  SvelteKit “crawleará” todos los enlaces localizados.
-->
<div style="display: none" aria-hidden="true">
	{#each locales as loc}
		<a href={localizeHref($page.url.pathname, { locale: loc })}>{loc}</a>
	{/each}
</div>

<style global>
	/* Transición suave al alternar tema */
	html {
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}
</style>
