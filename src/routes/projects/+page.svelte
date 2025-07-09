<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition'; // Animación de fade para el encabezado
	import { projects, personalInfo } from '$lib/data/portfolio.js'; // Datos de proyectos e info personal
	import * as m from '$lib/paraglide/messages'; // Mensajes de internacionalización
	import { page } from '$app/state'; // Acceso al store de la página (para el idioma)

	// Importar el componente ProjectCard (ahora es el que renderiza cada tarjeta)
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	// --- Variables de Estado Reactivas ---
	// Guarda los IDs de los elementos visibles en el viewport para las animaciones.
	let visibleElements = $state(new Set<string>());
	// Indica si el componente principal ya está montado, para controlar animaciones y skeletons.
	let mounted = $state(false);

	// Idioma actual de la página, derivado del store de SvelteKit.
	const currentLocale = $derived(page.data.paraglide?.lang || 'es');

	// --- Ciclo de Vida: onMount ---
	// Se ejecuta cuando el componente se monta en el DOM.
	onMount(() => {
		// Pequeño retraso para asegurar que el DOM esté listo antes de observar.
		setTimeout(() => {
			mounted = true; // Marca el componente como montado.

			// Crea un IntersectionObserver para detectar la visibilidad de los elementos.
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const id = (entry.target as HTMLElement).dataset.animateId;
							if (id) {
								visibleElements = new Set([...visibleElements, id]); // Añade el ID a los elementos visibles.
							}
						}
					});
				},
				{ threshold: 0.1, rootMargin: '50px' } // Un 10% del elemento visible o 50px de margen.
			);

			// Observa todos los elementos con el atributo `data-animate-id`.
			document
				.querySelectorAll<HTMLElement>('[data-animate-id]')
				.forEach((el) => observer.observe(el));

			// Función de limpieza del observador al destruir el componente.
			return () => observer.disconnect();
		}, 100);
	});

	// --- Datos Derivados ---
	// Proyectos ordenados por fecha de forma descendente (más recientes primero).
	const sortedProjects = projects.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
</script>

<svelte:head>
	<title>{m['nav.projects']()} - {personalInfo.name}</title>
	<meta name="description" content={m['projects.subtitle']()} />
</svelte:head>

<div
	class="container mx-auto px-4 py-12 md:p-8 font-inter antialiased text-gray-900 dark:text-white"
>
	<div class="text-center mb-16" data-animate-id="projects-header">
		{#if mounted && visibleElements.has('projects-header')}
			<div transition:fade={{ duration: 800, delay: 100 }}>
				<h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
					{m['projects.title']()}
				</h1>
				<p class="text-xl text-gray-600 dark:text-gray-400">
					{m['projects.subtitle']()}
				</p>
			</div>
		{:else}
			<h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 opacity-0">
				{m['projects.title']()}
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-400 opacity-0">
				{m['projects.subtitle']()}
			</p>
		{/if}
	</div>

	<div class="space-y-16">
		{#each sortedProjects as project, index}
			<div data-animate-id={`project-${project.id}`}>
				<ProjectCard {project} {index} {mounted} {visibleElements} {currentLocale} />
			</div>
		{/each}
	</div>
</div>
