<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
	/**
	 * Componente Footer (Pie de página) de la aplicación.
	 *
	 * Este componente proporciona información de navegación, contacto y tecnologías utilizadas.
	 * Integra Paraglide.js para la internacionalización de textos.
	 *
	 * Características:
	 * - Navegación con mensajes localizados.
	 * - Información de contacto con íconos.
	 * - Créditos de tecnologías utilizadas.
	 * - Re-render reactivo mediante `{#key currentLocale}` para cambios de idioma.
	 */

	// Internacionalización: mensajes y detección de idioma
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import { locales, getLocale } from '$lib/paraglide/runtime';

	// Información del usuario
	import { personalInfo } from '$lib/data/portfolio.js';

	// Iconos
	import { Mail, MapPin, Linkedin, Github } from '@lucide/svelte';

	/**
	 * @type {string} currentLocale - Idioma actual, detectado desde datos SSR o fallback.
	 */
	$: currentLocale = $page.data.paraglide?.lang || getLocale();

	/**
	 * @typedef {object} NavItem - Elemento de navegación con href y etiqueta traducible.
	 * @property {string} href - Ruta del enlace.
	 * @property {() => string} label - Función que devuelve el texto traducido.
	 */
	const navItems = [
		{ href: '/', label: m['nav.home'] },
		{ href: '/about', label: m['nav.about'] },
		{ href: '/projects', label: m['nav.projects'] },
		{ href: '/contact', label: m['nav.contact'] }
	];

	/**
	 * @type {Array} usedTech - Tecnologías utilizadas en el desarrollo.
	 */
	const usedTech = [
		{
			name: 'SvelteKit',
			logo: '/icons/svelte.svg',
			link: 'https://kit.svelte.dev/'
		},
		{
			name: 'Tailwind CSS',
			logo: '/icons/tailwind.svg',
			link: 'https://tailwindcss.com/docs/installation/framework-guides/sveltekit'
		},
		{
			name: 'Paraglide.js',
			logo: '/icons/paraglide.svg',
			link: 'https://inlang.com/m/gerre34r/library-inlang-paraglideJs'
		}
	];
</script>

<!-- Pie de página principal -->
<footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
	<div class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Navegación -->
			{#key currentLocale}
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white mb-4">
						{m['footer.navigation']()}
					</h3>
					<nav class="space-y-2">
						{#each navItems as item}
							<a
								href={item.href}
								class="block text-gray-600 dark:text-gray-400
                       hover:text-blue-600 dark:hover:text-blue-400
                       transition-colors"
							>
								{item.label()}
							</a>
						{/each}
					</nav>
				</div>
			{/key}

			<!-- Contacto y redes sociales -->
			{#key currentLocale}
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white mb-4">
						{m['contact.title']()}
					</h3>
					<div class="space-y-2">
						<div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
							<Mail class="w-6 h-6 flex-shrink-0" />
							<span>{personalInfo.email}</span>
						</div>
						<div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
							<MapPin class="w-6 h-6 flex-shrink-0" />
							<span>{personalInfo.location}</span>
						</div>
						<div class="flex items-center space-x-4 mt-2">
							<!-- GitHub -->
							<a
								href="https://github.com/misterlink19"
								target="_blank"
								aria-label="Enlace a GitHub"
								rel="noopener"
								class="text-gray-600 dark:text-gray-400
                       hover:text-gray-900 dark:hover:text-white
                       transition-colors"
							>
								<Github class="w-6 h-6 transition-transform transform hover:scale-110" />
							</a>

							<!-- LinkedIn -->
							<a
								href="https://www.linkedin.com/in/amle-martinez-marte-15a433208/"
								target="_blank"
								aria-label="Enlace a LinkedIn"
								rel="noopener"
								class="text-gray-600 dark:text-gray-400
                       hover:text-blue-700 dark:hover:text-blue-300
                       transition-colors"
							>
								<Linkedin class="w-6 h-6 transition-transform transform hover:scale-110" />
							</a>
						</div>
					</div>
				</div>
			{/key}

			<!-- Tecnologías usadas -->
			{#key currentLocale}
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white mb-4">
						{m['projects.technologiesUsed']()}
					</h3>
					<p class="text-gray-600 dark:text-gray-400 mb-4">
						{m['footer.builtWith']()}
					</p>
					<div class="flex items-center space-x-6">
						{#each usedTech as tech}
							<a
								href={tech.link}
								target="_blank"
								rel="noopener"
								class="flex flex-col items-center
                       text-gray-600 dark:text-gray-400
                       group"
							>
								<img
									src={tech.logo}
									alt="{tech.name} logo"
									class="w-8 h-8 mb-1 transition-transform transform group-hover:scale-110"
								/>
								<span class="text-xs">{tech.name}</span>
							</a>
						{/each}
					</div>
				</div>
			{/key}
		</div>

		<!-- Derechos de autor -->
		{#key currentLocale}
			<div
				class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700
               text-center text-gray-600 dark:text-gray-400"
			>
				<p>{m['footer.copyright']()}</p>
			</div>
		{/key}
	</div>
</footer>
