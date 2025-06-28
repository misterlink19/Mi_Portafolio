<script lang="ts">
    /**
     * Componente Timeline (Línea de Tiempo).
     *
     * Este componente visualiza una serie de eventos cronológicos, como experiencia laboral o formación académica.
     * Los elementos se organizan a lo largo de una línea central y aparecen con una animación
     * a medida que entran en el viewport (gracias a Intersection Observer).
     *
     * Características principales:
     * - Animación de entrada "fly" para los elementos cuando se hacen visibles.
     * - Soporte para dos tipos de línea de tiempo: 'work' (experiencia laboral) y 'education' (formación académica).
     * - Estilo visual adaptado al tipo de línea de tiempo (colores).
     * - Muestra información detallada como fechas, títulos/posiciones, empresas/instituciones y descripciones.
     * - Incluye tecnologías relacionadas para elementos de tipo 'work'.
     * - Utiliza Paraglide.js para traducir el texto "Presente" en las fechas.
     */

    // Importaciones de Svelte para el ciclo de vida, transiciones y efectos de easing.
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    // Importación de la librería de mensajes de Paraglide.js para internacionalización.
    import * as m from '$lib/paraglide/messages';

    /**
     * @interface BaseTimelineItem
     * Define la estructura base de cualquier elemento de la línea de tiempo.
     * @property {string} id - ID único para el elemento, usado para seguimiento y animaciones.
     * @property {string | number} startYear - Año de inicio del evento.
     * @property {string | number | null} endYear - Año de finalización del evento (null si es "actual").
     * @property {string} description - Descripción detallada del evento.
     */
    interface BaseTimelineItem {
        id: string;
        startYear: string | number;
        endYear: string | number | null;
        description: string;
    }

    /**
     * @interface WorkTimelineItem
     * Extiende `BaseTimelineItem` para representar un elemento de experiencia laboral.
     * @property {string} position - Cargo o posición.
     * @property {string} company - Nombre de la empresa.
     * @property {'work'} type - Tipo explícito para la discriminación de la unión.
     * @property {string[]} [technologies] - Lista opcional de tecnologías utilizadas en este rol.
     */
    interface WorkTimelineItem extends BaseTimelineItem {
        position: string;
        company: string;
        type: 'work';
        technologies?: string[];
    }

    /**
     * @interface EducationTimelineItem
     * Extiende `BaseTimelineItem` para representar un elemento de formación académica.
     * @property {string} degree - Título o grado obtenido.
     * @property {string} institution - Nombre de la institución educativa.
     * @property {'education'} type - Tipo explícito para la discriminación de la unión.
     */
    interface EducationTimelineItem extends BaseTimelineItem {
        degree: string;
        institution: string;
        type: 'education';
    }

    /**
     * @type {TimelineItem} - Tipo de unión que puede ser `WorkTimelineItem` o `EducationTimelineItem`.
     */
    type TimelineItem = WorkTimelineItem | EducationTimelineItem;

    /**
     * @interface Props
     * Define las propiedades que el componente `Timeline` acepta.
     * @property {TimelineItem[]} items - Array de elementos a mostrar en la línea de tiempo.
     * @property {'work' | 'education'} type - Determina el tipo general de la línea de tiempo, afectando el color.
     */
    interface Props {
        items: TimelineItem[];
        type: 'work' | 'education';
    }

    // Desestructuración de las propiedades del componente.
    let { items, type }: Props = $props();

    /**
     * @type {HTMLElement | null} timelineContainer - Referencia al elemento DOM del contenedor principal
     * de la línea de tiempo, usada para observar la intersección de sus hijos.
     * Se enlaza usando `bind:this`.
     */
    let timelineContainer: HTMLElement | null = null;

    /**
     * @type {Set<string>} visibleItems - Conjunto reactivo que almacena los IDs de los elementos
     * de la línea de tiempo que actualmente están visibles en el viewport.
     * El uso de `$state` asegura que los cambios en el Set activen las actualizaciones de Svelte.
     */
    let visibleItems = $state(new Set<string>());

    /**
     * onMount: Hook del ciclo de vida de Svelte que se ejecuta una vez que el componente ha sido montado en el DOM.
     * Aquí se configura un Intersection Observer para detectar cuando los elementos de la línea de tiempo
     * entran en el viewport y disparar sus animaciones.
     */
    onMount(() => {
        // Si el contenedor de la línea de tiempo no está disponible, se sale.
        if (!timelineContainer) return;

        /**
         * Inicialización del Intersection Observer.
         * Detecta cuándo un elemento entra o sale del viewport.
         */
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Si el elemento está visible (intersecando el viewport)
                        const id = (entry.target as HTMLElement).dataset.itemId;
                        if (id) {
                            visibleItems.add(id);
                            // Se crea un nuevo Set para forzar la reactividad en Svelte (para colecciones como Set/Map).
                            visibleItems = new Set(visibleItems);
                        }
                    }
                });
            },
            // Opciones del Intersection Observer:
            // - threshold: 0.1 significa que se considerará "visible" cuando el 10% del elemento esté en el viewport.
            // - rootMargin: '0px 0px -100px 0px' ajusta el viewport para que la detección ocurra 100px antes del final de la pantalla.
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        // Se observa cada elemento de la línea de tiempo que tiene el atributo `data-item-id`.
        timelineContainer
            .querySelectorAll<HTMLElement>('[data-item-id]')
            .forEach((el) => observer.observe(el));

        /**
         * Función de limpieza del onMount.
         * Se desconecta el Intersection Observer cuando el componente es destruido,
         * para evitar fugas de memoria.
         */
        return () => observer.disconnect();
    });

    /**
     * Función utilitaria para obtener la clase de color Tailwind CSS
     * basada en el tipo de línea de tiempo ('work' o 'education').
     * @param {'work' | 'education'} t - El tipo de línea de tiempo.
     * @returns {string} La clase CSS de color.
     */
    const getColorClass = (t: 'work' | 'education') =>
        t === 'work'
            ? 'bg-blue-600 dark:bg-blue-400'
            : t === 'education'
                ? 'bg-green-600 dark:bg-green-400'
                : 'bg-gray-600 dark:bg-gray-400';
</script>

<div bind:this={timelineContainer} class="relative">
    <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full {getColorClass(type)}"></div>

    {#each items as item, index}
        {@const isLastItem = index === items.length - 1} 
        <div class="relative flex items-center mb-8" data-item-id={item.id}>
            <div class="flex-1 {index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}">
                {#if visibleItems.has(item.id)}
                    <div transition:fly={{ y: 30, duration: 600, delay: index * 100, easing: quintOut }}>
                        <div
                            class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
                        >
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {item.type === 'work'
                                    ? (item as WorkTimelineItem).position
                                    : (item as EducationTimelineItem).degree}
                            </h3>
                            <p
                                class="font-medium mb-1"
                                class:text-blue-600={type === 'work'}
                                class:dark:text-blue-400={type === 'work'}
                                class:text-green-600={type === 'education'}
                                class:dark:text-green-400={type === 'education'}
                            >
                                {item.type === 'work'
                                    ? (item as WorkTimelineItem).company
                                    : (item as EducationTimelineItem).institution}
                            </p>
                            <p class="text-gray-500 dark:text-gray-400 text-sm mb-2">
                                {item.startYear} - {item.endYear ?? m['timeline.present']()}
                            </p>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                            {#if item.type === 'work' && (item as WorkTimelineItem).technologies && (item as WorkTimelineItem).technologies.length > 0}
                                <div
                                    class="flex flex-wrap gap-2 mt-3 {index % 2 === 0
                                        ? 'justify-end'
                                        : 'justify-start'}"
                                >
                                    {#each (item as WorkTimelineItem).technologies as tech}
                                        <span
                                            class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                                        >
                                            {tech}
                                        </span>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 h-48 opacity-0"></div>
                {/if}
            </div>
            <div
                class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 {getColorClass(
                    type
                )} rounded-full border-4 border-white dark:border-gray-900 z-10
                {isLastItem ? 'bottom-2' : 'top-2'}"
            ></div>
        </div>
    {/each}
</div>