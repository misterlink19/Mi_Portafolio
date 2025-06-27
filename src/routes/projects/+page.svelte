<script lang="ts">
    /**
     * Página de proyectos del portafolio.
     *
     * Muestra una lista de proyectos, cada uno con su descripción, tecnologías,
     * imágenes, enlaces a demo en vivo y repositorio de GitHub.
     * Incorpora animaciones de entrada y un efecto de "skeleton loading" (carga esquelética).
     */

    // Importaciones de Svelte para ciclo de vida y transiciones.
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    // Importación de datos de proyectos y información personal.
    import { projects, personalInfo } from '$lib/data/portfolio.js';
    // Librería de mensajes de Paraglide.js para internacionalización.
    import * as m from '$lib/paraglide/messages';
    // Store de SvelteKit para acceder a los datos de la página (incluida la locale).
    import { page } from '$app/stores';
    // Iconos de Lucide Svelte (enlace externo, GitHub, imagen no disponible).
    import { ExternalLink, Github, ImageOff } from '@lucide/svelte';

    // --- Variables de Estado Reactivas ---
    /**
     * @type {Set<string>} visibleElements - IDs de los elementos visibles en el viewport.
     * Controla las animaciones de entrada.
     */
    let visibleElements = $state(new Set<string>());
    /**
     * @type {boolean} mounted - Indica si el componente ya está montado en el DOM.
     * Utilizado para retrasar la activación de animaciones y mostrar placeholders iniciales.
     */
    let mounted = $state(false);

    /**
     * @type {string} currentLocale - Idioma actual de la página, derivado del store `$page.data.paraglide.lang`.
     * Utilizado para formatear fechas.
     */
    const currentLocale = $derived($page.data.paraglide?.lang || 'es');

    /**
     * Hook `onMount`: Se ejecuta cuando el componente se monta en el DOM.
     * Inicializa el IntersectionObserver para controlar las animaciones de entrada
     * de los elementos con el atributo `data-animate-id`.
     */
    onMount(() => {
        setTimeout(() => {
            mounted = true; // El componente está montado, las animaciones pueden activarse.
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const id = (entry.target as HTMLElement).dataset.animateId;
                            if (id) {
                                visibleElements = new Set([...visibleElements, id]); // Añade el ID a los elementos visibles
                            }
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '50px' } // El elemento es visible cuando el 10% está en el viewport
            );

            // Observa todos los elementos con `data-animate-id`
            document.querySelectorAll<HTMLElement>('[data-animate-id]').forEach(el => observer.observe(el));

            return () => observer.disconnect(); // Limpia el observador al destruir el componente
        }, 100); // Pequeño retraso para asegurar que el DOM esté renderizado.
    });

    /**
     * @type {Array<Object>} sortedProjects - Array de proyectos ordenados por fecha de forma descendente (más recientes primero).
     */
    const sortedProjects = projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
</script>

<svelte:head>
    <title>{m['nav.projects']()} - {personalInfo.name}</title>
    <meta name="description" content={m['projects.subtitle']()} />
</svelte:head>

<div class="container mx-auto px-4 py-12 md:p-8 font-inter antialiased text-gray-900 dark:text-white">
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
                {#if mounted && visibleElements.has(`project-${project.id}`)}
                    <div transition:fly={{ y: 50, duration: 600, delay: index * 200, easing: quintOut }}>
                        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
                                <div class="p-6 md:p-8 flex items-center justify-center">
                                    {#if project.images && project.images.length > 0}
                                        <div class="space-y-4 w-full">
                                            {#each project.images as image, imgIndex}
                                                <div
                                                    class="overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                                    transition:fly={{ y: 20, duration: 400, delay: imgIndex * 100, easing: quintOut }}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`${m[project.nameKey]()} - Imagen ${imgIndex + 1}`}
                                                        class="w-full h-auto object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            {/each}
                                        </div>
                                    {:else}
                                        <div class="w-full h-48 bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center rounded-lg text-gray-500 dark:text-gray-400">
                                            <ImageOff class="w-16 h-16 mb-2" />
                                            <p class="text-center">{m['projects.noImage']()}</p>
                                        </div>
                                    {/if}
                                </div>

                                <div class="p-6 md:p-8 flex flex-col justify-center">
                                    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                        {m[project.nameKey]()}
                                    </h2>
                                    <p class="text-gray-600 dark:text-gray-300 text-lg mb-6">
                                        {m[project.descriptionKey]()}
                                    </p>

                                    <div class="mb-6">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            {m['projects.technologiesUsed']()}
                                        </h3>
                                        <div class="flex flex-wrap gap-2">
                                            {#each project.technologies as tech, techIndex}
                                                <span
                                                    class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:scale-105 transition-transform duration-200"
                                                    transition:fly={{ y: 10, duration: 300, delay: techIndex * 50, easing: quintOut }}
                                                >
                                                    {tech}
                                                </span>
                                            {/each}
                                        </div>
                                    </div>

                                    <div class="flex flex-col sm:flex-row gap-4 mb-6">
                                        {#if project.liveUrl}
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
                                            >
                                                <ExternalLink class="w-5 h-5 mr-2" />
                                                {m['projects.liveDemo']()}
                                            </a>
                                        {/if}
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
                                        >
                                            <Github class="w-5 h-5 mr-2" />
                                            {m['projects.viewCode']()}
                                        </a>
                                    </div>

                                    <div class="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(project.date).toLocaleDateString(currentLocale.includes('es') ? 'es-ES' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {:else}
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
                            <div class="p-6 md:p-8">
                                <div class="h-48 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                            </div>
                            <div class="p-6 md:p-8 flex flex-col justify-center">
                                <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4 animate-pulse"></div>
                                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4 animate-pulse"></div>
                                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-6 w-1/2 animate-pulse"></div>
                                <div class="flex flex-wrap gap-2 mb-6">
                                    <div class="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                                    <div class="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                                </div>
                                <div class="flex flex-col sm:flex-row gap-4">
                                    <div class="h-12 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                                    <div class="h-12 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>