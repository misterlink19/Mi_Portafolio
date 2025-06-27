<!-- src/lib/components/Header.svelte -->
<script lang="ts">
	/**
	 * Componente Header (Encabezado) de la aplicación.
	 *
	 * Este componente proporciona la barra de navegación superior, incluyendo:
	 * - Navegación principal del sitio.
	 * - Selector de tema (claro/oscuro).
	 * - Selector de idioma (internacionalización con Paraglide.js).
	 * - Menú móvil responsivo.
	 *
	 * Características clave:
	 * - Posicionamiento fijo en la parte superior para una navegación constante.
	 * - Efecto de desenfoque (`backdrop-blur`) para un diseño moderno.
	 * - Resalta el enlace de la página activa.
	 * - Gestión de estado del menú móvil.
	 * - Integración completa con Paraglide.js para rutas y mensajes localizados.
	 * - Alternancia de tema claro/oscuro.
	 */

	// Importaciones de SvelteKit para acceso a stores de la página y navegación.
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Importaciones de Paraglide.js para funcionalidades de internacionalización.
	import { locales, getLocale, localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	// Importaciones para la gestión del tema de la aplicación.
	import { theme, toggleTheme } from '$lib/stores/theme';

	// Importación de iconos de Lucide Svelte para una interfaz visualmente rica.
	import { Moon, Sun, Globe, Menu, X } from '@lucide/svelte';

	/**
	 * @type {boolean} mobileMenuOpen - Variable de estado que controla la visibilidad del menú móvil.
	 */
	let mobileMenuOpen = false;

	/**
	 * @type {string} currentLocale - Variable reactiva que almacena el idioma actual de la aplicación.
	 * Se deriva del store de la página de Paraglide.js o, como fallback, de la función `getLocale()`.
	 */
	$: currentLocale = $page.data.paraglide?.lang || getLocale();

	/**
	 * @type {string} currentPath - Variable reactiva que almacena la ruta de la URL actual.
	 */
	$: currentPath = $page.url.pathname;

	/**
	 * @type {string} basePath - Variable reactiva que calcula la ruta base de la URL.
	 * Se utiliza para generar enlaces de idioma correctos y para determinar el enlace activo.
	 * Elimina el prefijo de idioma de la ruta actual si existe.
	 */
	$: basePath = currentPath.startsWith(`/${currentLocale}`)
		? currentPath.replace(`/${currentLocale}`, '') || '/'
		: currentPath || '/';

	/**
	 * @interface NavItem - Define la estructura de un elemento de navegación.
	 * @property {string} href - La ruta del enlace.
	 * @property {() => string} label - Una función que devuelve el texto traducido del enlace.
	 */
	interface NavItem {
		href: string;
		label: () => string;
	}

	/**
	 * @type {NavItem[]} navItems - Array que contiene los objetos para los enlaces de navegación principal.
	 * Cada `label` es una referencia a una función de mensaje de Paraglide.js.
	 */
	const navItems: NavItem[] = [
		{ href: '/', label: m['nav.home'] },
		{ href: '/about', label: m['nav.about'] },
		{ href: '/projects', label: m['nav.projects'] },
		{ href: '/contact', label: m['nav.contact'] }
	];

	/**
	 * Función para alternar el idioma de la aplicación.
	 * Calcula el siguiente idioma en la lista de `locales` y navega a la misma ruta
	 * con el nuevo prefijo de idioma.
	 */
	function toggleLanguage() {
		const idx = locales.indexOf(currentLocale);
		const next = locales[(idx + 1) % locales.length]; // Obtiene el siguiente idioma en el array (circular)
		const newHref = localizeHref(basePath, { locale: next }); // Localiza la ruta base con el nuevo idioma

		goto(newHref); // Navega a la nueva URL
	}

	/**
	 * Función para cerrar el menú móvil.
	 */
	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<!--
    Elemento principal <header>.
    Clases de Tailwind CSS para posicionamiento fijo, fondo semitransparente con desenfoque,
    borde inferior y alto z-index para que esté siempre visible.
-->
<header
	class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80
                backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50"
>
	<!-- Contenedor de la barra de navegación principal -->
	<nav class="container mx-auto px-4 py-4 flex items-center justify-between">
		<!-- Enlace del logo/título del portafolio, que lleva a la página de inicio localizada -->
		<a
			href={localizeHref('/', { locale: currentLocale })}
			class="text-xl font-bold text-gray-900 dark:text-white"
		>
			Portfolio
		</a>

		<!-- Navegación principal para pantallas medianas y grandes (oculta en móviles) -->
		<div class="hidden md:flex items-center space-x-8">
			<!--
                Bloque #key currentLocale: Asegura que los enlaces de navegación
                se re-rendericen y sus textos se actualicen si el idioma cambia.
            -->
			{#key currentLocale}
				{#each navItems as item}
					<a
						href={localizeHref(item.href, { locale: currentLocale })}
						class="text-gray-700 dark:text-gray-300 hover:text-blue-600
                             dark:hover:text-blue-400 transition-colors"
						class:text-blue-600={basePath === item.href}
					>
						{item.label()}
						<!-- Llama a la función de mensaje para obtener el texto traducido -->
					</a>
				{/each}
			{/key}
		</div>

		<!-- Contenedor de botones de utilidades (tema, idioma, menú móvil) -->
		<div class="flex items-center space-x-4">
			<!-- Botón para alternar el tema (claro/oscuro) -->
			<button
				on:click={toggleTheme}
				aria-label="Toggle theme"
				class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800
                     hover:bg-gray-200 dark:hover:bg-gray-700"
			>
				{#if $theme === 'light'}
					<Moon class="w-5 h-5" /> <!-- Icono de luna para tema claro -->
				{:else}
					<Sun class="w-5 h-5" /> <!-- Icono de sol para tema oscuro -->
				{/if}
			</button>

			<!-- Botón para alternar el idioma -->
			<button
				on:click={toggleLanguage}
				aria-label="Toggle language"
				class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800
                     hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center space-x-1"
			>
				<Globe class="w-5 h-5" />
				<!-- Icono de globo terráqueo -->
				<span class="text-sm font-medium">
					{currentLocale.toUpperCase()}
					<!-- Muestra el código del idioma en mayúsculas -->
				</span>
			</button>

			<!-- Botón del menú móvil (visible solo en pantallas pequeñas) -->
			<button
				on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
				class="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800
                     hover:bg-gray-200 dark:hover:bg-gray-700"
			>
				{#if mobileMenuOpen}
					<X class="w-5 h-5" /> <!-- Icono de 'X' cuando el menú está abierto -->
				{:else}
					<Menu class="w-5 h-5" /> <!-- Icono de 'menú hamburguesa' cuando el menú está cerrado -->
				{/if}
			</button>
		</div>
	</nav>

	<!-- Menú móvil desplegable (visible solo en pantallas pequeñas y cuando 'mobileMenuOpen' es true) -->
	{#if mobileMenuOpen}
		<div class="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
			<!--
                Bloque #key currentLocale: Asegura que los enlaces del menú móvil
                se re-rendericen y sus textos se actualicen si el idioma cambia.
            -->
			{#key currentLocale}
				{#each navItems as item}
					<a
						href={localizeHref(item.href, { locale: currentLocale })}
						on:click={closeMobileMenu}
						class="block py-2 text-gray-700 dark:text-gray-300
                             hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						class:text-blue-600={basePath === item.href}
					>
						{item.label()}
						<!-- Llama a la función de mensaje para obtener el texto traducido -->
					</a>
				{/each}
			{/key}
		</div>
	{/if}
</header>
