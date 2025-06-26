<!-- src/routes/+page.svelte -->
<script lang="ts">
	/**
	 * Página de inicio con Paraglide
	 * - Mensajes traducidos con `m[...]()`
	 * - Navegación con `goto(localizeHref(...))`
	 * - Transiciones `fade` y `fly`
	 */

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	// Tu datos de portafolio
	import { personalInfo } from '$lib/data/portfolio.js';

	// 1) Calcula el locale actual extrayendo la primera parte de la ruta:
	//    /en/... → 'en', /es/... → 'es', si no hay prefijo → 'es'
	$: segments = $page.url.pathname.split('/');
	$: currentLocale = segments[1] || 'es';

	// 2) Navega a “About” manteniendo locale
	function navigateToAbout() {
		// Construye '/en/about' o '/es/about' o '/about' según configuración
		const href = localizeHref('/about', { locale: currentLocale });
		goto(href);
	}
</script>

<svelte:head>
	<!-- Título y meta dinámicos traducidos -->
	<title>{personalInfo.name} — {m['home.title']()}</title>
	<meta name="description" content={personalInfo.summary[currentLocale]} />
</svelte:head>

<section class="min-h-screen flex items-center justify-center px-4">
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
			<!-- FOTO + NOMBRE + CARGO -->
			<div class="text-center lg:text-left">
				<div class="mb-8" transition:fade={{ duration: 800, delay: 200 }}>
					<img
						src={personalInfo.photo || "../../../static/favicon.png"}
						alt={personalInfo.name}
						class="w-64 h-64 rounded-full mx-auto lg:mx-0 object-cover shadow-2xl hover:scale-105 transition-transform duration-300"
					/>
				</div>

				<div transition:fly={{ y: 30, duration: 600, delay: 400, easing: quintOut }}>
					<h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
						{personalInfo.name}
					</h1>
					<h2 class="text-xl lg:text-2xl text-blue-600 dark:text-blue-400 font-medium">
						{m['home.title']()}
					</h2>
				</div>
			</div>

			<!-- SALUDO + RESUMEN + BOTÓN -->
			<div
				class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
				transition:fly={{ x: 50, duration: 600, delay: 600, easing: quintOut }}
			>
				<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
					{m['home.greeting']()}
				</h3>

				<p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
					{personalInfo.summary[currentLocale]}
				</p>

				<button
					on:click={navigateToAbout}
					class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 text-lg hover:scale-105 hover:shadow-lg"
				>
					{m['home.learnMore']()} →
				</button>
			</div>
		</div>
	</div>
</section>
