<script lang="ts">
	/**
	 * Componente Footer (Pie de Página) de la aplicación.
	 *
	 * Muestra información esencial en la parte inferior de todas las páginas,
	 * incluyendo navegación, datos de contacto, tecnologías utilizadas y derechos de autor.
	 *
	 * Características:
	 * - Utiliza mensajes internacionalizados con Paraglide.js para soporte multilingüe.
	 * - Adapta la navegación según la estructura del sitio.
	 * - Renderiza dinámicamente según el idioma activo para asegurar la traducción de los textos.
	 */

	// Importación de la librería de mensajes de Paraglide.js para la internacionalización.
	import * as m from '$lib/paraglide/messages';
	// Importación del store 'page' de SvelteKit para acceder a los datos de la página actual,
	// incluyendo la información de la localización.
	import { page } from '$app/stores';
	// Importación de 'getLocale' de Paraglide.js para obtener el idioma actual si no está disponible en el store de la página.
	import { getLocale } from '$lib/paraglide/runtime';

	/**
	 * @type {string} currentLocale - Variable reactiva que almacena el idioma actual de la aplicación.
	 * Se obtiene primero de los datos de la página (ideal para SSR) o, como fallback, de la función getLocale() de Paraglide.
	 */
	$: currentLocale = $page.data.paraglide?.lang || getLocale();

	/**
	 * @type {Array<Object>} navItems - Array que define los elementos de navegación del footer.
	 * Cada objeto contiene:
	 * - href: La ruta a la que apunta el enlace.
	 * - label: La función de mensaje de Paraglide.js que devuelve el texto traducido del enlace.
	 */
	const navItems = [
		{ href: '/', label: m['nav.home'] },
		{ href: '/about', label: m['nav.about'] },
		{ href: '/projects', label: m['nav.projects'] },
		{ href: '/contact', label: m['nav.contact'] }
	];
</script>

<footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
	<div class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div>
				{#key currentLocale}
					<h3 class="font-semibold text-gray-900 dark:text-white mb-4">{m['nav.home']()}</h3>
				{/key}
				<div class="space-y-2">
					{#each navItems as item}
						<a
							href={item.href}
							class="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							{#key currentLocale}
								{item.label()}
							{/key}
						</a>
					{/each}
				</div>
			</div>

			<div>
				{#key currentLocale}
					<h3 class="font-semibold text-gray-900 dark:text-white mb-4">{m['contact.title']()}</h3>
				{/key}
				<div class="space-y-2 text-gray-600 dark:text-gray-400">
					<p>tu@email.com</p>
					<p>Tu Ciudad, País</p>
				</div>
			</div>

			<div>
				<h3 class="font-semibold text-gray-900 dark:text-white mb-4">Tecnología</h3>
				{#key currentLocale}
					<p class="text-gray-600 dark:text-gray-400">{m['footer.builtWith']()}</p>
				{/key}
			</div>
		</div>

		<div
			class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400"
		>
			{#key currentLocale}
				<p>{m['footer.copyright']()}</p>
			{/key}
		</div>
	</div>
</footer>
