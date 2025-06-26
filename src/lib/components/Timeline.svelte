<!-- src/lib/components/Timeline.svelte -->
<script lang="ts">
    /**
     * Componente de línea de tiempo para experiencias laborales o educativas.
     * - Internacionalización con Paraglide.
     * - Inserción automática de gaps (brechas entre periodos).
     * - Animaciones con IntersectionObserver + fly.
     * - Tipado seguro en Svelte + TypeScript.
     */

    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import * as m from '$lib/paraglide/messages';

    // Definición de la estructura de cada ítem de la línea de tiempo
    interface TimelineItem {
        id?: string | number;
        startYear: string | number;
        endYear?: string | number;
        position?: string;
        company?: string;
        degree?: string;
        institution?: string;
        description: string;
        technologies?: string[];
    }

    // Props esperadas: lista de ítems y tipo (work|education)
    interface Props {
        items: TimelineItem[];
        type?: 'work' | 'education';
    }

    let { items, type = 'work' }: Props = $props();

    // Contenedor de la línea para observar visibilidad
    let timelineContainer: HTMLElement | null = null;
    // Conjunto de IDs de ítems ya visibles (para animar solo una vez)
    let visibleItems = new Set<string>();

    const currentYear = new Date().getFullYear();

    // Orden descendente por endYear (o currentYear si no lo tienen)
    const sortedItems = [...items].sort((a, b) => {
        const yearA = parseInt(a.endYear?.toString() || currentYear.toString());
        const yearB = parseInt(b.endYear?.toString() || currentYear.toString());
        return yearB - yearA;
    });

    // Generar rango de años para indicadores laterales
    const allYears = sortedItems.flatMap(item => [
        parseInt(item.startYear.toString()),
        parseInt(item.endYear?.toString() || currentYear.toString())
    ]);
    const timelineStart = Math.max(...allYears);
    const timelineEnd = Math.min(...allYears);
    const yearMarkers: number[] = [];
    for (let y = timelineStart; y >= timelineEnd; y--) {
        yearMarkers.push(y);
    }

    // Insertar gaps y calcular duración de cada periodo
    const processedItems: (TimelineItem & { isGap: boolean; duration: number })[] = [];
    let previousEnd = timelineStart + 1;
    sortedItems.forEach(item => {
        const start = parseInt(item.startYear.toString());
        const end = parseInt(item.endYear?.toString() || currentYear.toString());

        // Gap si hay separación de años
        if (previousEnd - 1 > end) {
            processedItems.push({
                isGap: true,
                startYear: end + 1,
                endYear: previousEnd - 1,
                description: '',
                duration: previousEnd - end - 1
            });
        }

        processedItems.push({
            ...item,
            startYear: start,
            endYear: end,
            duration: end - start + 1,
            isGap: false
        });

        previousEnd = start;
    });

    /**
     * Observer para animar entradas al hacer scroll
     */
    onMount(() => {
        if (!timelineContainer) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const el = entry.target as HTMLElement;
                    const id = el.dataset.itemId;
                    if (entry.isIntersecting && id) {
                        visibleItems.add(id);
                    }
                }
            },
            { threshold: 0.3 }
        );

        // Observar cada elemento con data-item-id
        timelineContainer
            .querySelectorAll<HTMLElement>('[data-item-id]')
            .forEach(el => observer.observe(el));

        return () => observer.disconnect();
    });

    // Clase de color según tipo de timeline
    const getColorClass = (t: string) =>
        t === 'work' ? 'bg-blue-600' :
        t === 'education' ? 'bg-green-600' : 'bg-gray-600';

    // Sufijo de plural en español
    const pluralSuffix = (n: number) => (n === 1 ? '' : 's');
</script>

<!-- Contenedor principal de la timeline -->
<div bind:this={timelineContainer} class="relative max-w-4xl mx-auto">
    <!-- Línea vertical base -->
    <div class="absolute left-8 top-0 w-1 h-full {getColorClass(type)} opacity-30"></div>

    <!-- Indicadores de años alternos -->
    <div class="absolute left-0 top-0 h-full">
        {#each yearMarkers.filter((_, i) => i % 2 === 0) as year, i}
            <div class="absolute flex items-center" style="top: {(i * 120)}px">
                <div class="w-6 h-6 rounded-full {getColorClass(type)} flex items-center justify-center text-white text-xs font-bold">
                    {year.toString().slice(-2)}
                </div>
                <span class="ml-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {year}
                </span>
            </div>
        {/each}
    </div>

    <!-- Ítems procesados (gaps + experiencias) -->
    <div class="ml-20 space-y-6">
        {#each processedItems as item, idx}
            <div data-item-id={item.id ?? `gap-${idx}`} class="relative">
                <!-- Línea horizontal conectando punto y bloque -->
                <div
                    class="absolute -left-12 top-6 w-8 h-0.5 {getColorClass(type)}"
                    style="opacity: {visibleItems.has((item.id ?? `gap-${idx}`).toString()) ? 1 : 0.3}; transition: opacity 0.5s ease;"
                ></div>

                {#if item.isGap}
                    <!-- Bloque de gap -->
                    {#if visibleItems.has(`gap-${idx}`)}
                        <div transition:fly={{ x: 50, duration: 600, easing: quintOut }}>
                            <div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400">
                                <p class="text-sm font-medium">
                                    {m['timeline.gap']({ n: item.duration, s: pluralSuffix(item.duration) })}
                                </p>
                                <p class="text-xs">{item.startYear} - {item.endYear}</p>
                            </div>
                        </div>
                    {:else}
                        <div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-30">
                            <p class="text-sm font-medium">
                                {m['timeline.gap']({ n: item.duration, s: pluralSuffix(item.duration) })}
                            </p>
                            <p class="text-xs">{item.startYear} - {item.endYear}</p>
                        </div>
                    {/if}
                {:else}
                    <!-- Bloque de experiencia o educación -->
                    {#if visibleItems.has((item.id ?? `gap-${idx}`).toString())}
                        <div transition:fly={{ x: 50, duration: 600, easing: quintOut }}>
                            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                                <div class="flex justify-between items-start mb-3">
                                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                                        {item.position ?? item.degree}
                                    </h3>
                                    <span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        {m['timeline.duration']({ n: item.duration, s: pluralSuffix(item.duration) })}
                                    </span>
                                </div>

                                <p class="text-blue-600 dark:text-blue-400 font-medium mb-2">
                                    {item.company ?? item.institution}
                                </p>
                                <p class="text-gray-500 dark:text-gray-400 text-sm mb-3">
                                    {item.startYear} -
                                    {item.endYear ?? m['timeline.present']()}
                                </p>
                                <p class="text-gray-600 dark:text-gray-300 mb-4">
                                    {item.description}
                                </p>

                                {#if item.technologies}
                                    <div class="flex flex-wrap gap-2">
                                        {#each item.technologies as tech}
                                            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                                {tech}
                                            </span>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {:else}
                        <!-- Placeholder gris para preload -->
                        <div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 opacity-30">
                            <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                            <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                        </div>
                    {/if}
                {/if}
            </div>
        {/each}
    </div>
</div>
