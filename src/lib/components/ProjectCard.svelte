<script lang="ts">
  // Core Svelte: animaciones y easing
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  // Componentes e iconos: elementos visuales y funcionales
  import ImageCarousel from '$lib/components/ImageCarousel.svelte';
  import { ExternalLink, Github } from '@lucide/svelte';

  // Utilidades: internacionalización
  import * as m from '$lib/paraglide/messages';

  // --- Tipado de Datos del Proyecto ---
  // Define la estructura de los datos que espera este componente para un proyecto.
  interface Project {
    id: string;
    nameKey: string; // Clave para obtener el nombre traducido.
    descriptionKey: string; // Clave para obtener la descripción traducida.
    date: string; // Fecha de creación o actualización del proyecto.
    images: string[]; // Rutas a las imágenes del proyecto.
    technologies: string[]; // Lista de tecnologías usadas.
    githubUrl: string; // URL del repositorio de GitHub.
    liveUrl?: string; // URL de la demo en vivo (opcional).
  }

  // --- Declaración de Props ---
  // Utiliza $props para declarar y tipar las propiedades recibidas del componente padre.
  let { project, index, mounted, visibleElements, currentLocale } = $props<{
    project: Project; // Datos completos del proyecto.
    index: number; // Índice del proyecto en la lista (para animaciones escalonadas).
    mounted: boolean; // Indica si la página principal ha terminado de montarse.
    visibleElements: Set<string>; // Conjunto de IDs de elementos que están en el viewport.
    currentLocale: string; // Locale actual para formateo de fechas.
  }>();

  // --- Lógica Auxiliar ---
  // Determina si el proyecto actual debe mostrarse con animaciones o como esqueleto.
  const shouldAnimate = $derived(mounted && visibleElements.has(`project-${project.id}`));

  // Formatea la fecha del proyecto según la localización.
  const formattedDate = $derived(
    new Date(project.date).toLocaleDateString(
      currentLocale.includes('es') ? 'es-ES' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
  );

  // Clases CSS comunes para los botones de enlace.
  const linkButtonClasses =
    'flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg';
</script>

{#if shouldAnimate}
  <div
    transition:fly={{ y: 50, duration: 600, delay: index * 200, easing: quintOut }}
    class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow duration-500"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
      <div class="p-6 md:p-8 flex items-center justify-center">
        <ImageCarousel images={project.images} projectId={project.id} />
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
              data-sveltekit-preload-code="viewport"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="{linkButtonClasses} bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink class="w-5 h-5 mr-2" />
              {m['projects.liveDemo']()}
            </a>
          {/if}
          <a
            data-sveltekit-preload-code="viewport"
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="{linkButtonClasses} bg-green-500 hover:bg-green-600 text-white"
          >
            <Github class="w-5 h-5 mr-2" />
            {m['projects.viewCode']()}
          </a>
        </div>

        <div class="text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
      <div class="p-6 md:p-8">
        <div class="h-48 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
      </div>
      <div class="p-6 md:p-8 flex flex-col justify-center">
        <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-3/4 animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-full animate-pulse"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-6 w-2/3 animate-pulse"></div>
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