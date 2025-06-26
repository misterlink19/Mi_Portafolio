<script lang="ts">
    /**
     * Componente visual para mostrar una habilidad con su nivel correspondiente
     * - Usa Paraglide para traducir los niveles
     * - Usa animación `fly` con easing personalizado
     * - Adapta el color y ancho del progreso según el nivel
     */

    import { fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import * as m from '$lib/paraglide/messages';

    // Props esperadas del componente
    interface Props {
        skill: {
            name: string;
            level: string;
        };
        index?: number;
    }

    // Desestructuración de props con valor predeterminado para index
    let { skill, index = 0 }: Props = $props();

    /**
     * Devuelve la clase de color según el nivel
     */
    const getLevelColor = (level: string): string => {
        switch (level.toLowerCase()) {
            case 'básico':
            case 'basic':
                return 'bg-red-500';
            case 'intermedio':
            case 'intermediate':
                return 'bg-yellow-500';
            case 'avanzado':
            case 'advanced':
                return 'bg-blue-500';
            case 'experto':
            case 'expert':
            case 'nativo':
            case 'native':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    /**
     * Devuelve el ancho proporcional del progreso según el nivel
     */
    const getLevelWidth = (level: string): string => {
        switch (level.toLowerCase()) {
            case 'básico':
            case 'basic':
                return '25%';
            case 'intermedio':
            case 'intermediate':
                return '50%';
            case 'avanzado':
            case 'advanced':
                return '75%';
            case 'experto':
            case 'expert':
            case 'nativo':
            case 'native':
                return '100%';
            default:
                return '0%';
        }
    };

    /**
     * Traduce el nivel al idioma activo con Paraglide
     */
    const getLevelLabel = (level: string): string => {
        const key = level.toLowerCase();
        if (['básico', 'basic'].includes(key)) return m['skills.basic']();
        if (['intermedio', 'intermediate'].includes(key)) return m['skills.intermediate']();
        if (['avanzado', 'advanced'].includes(key)) return m['skills.advanced']();
        if (['experto', 'expert'].includes(key)) return m['skills.expert']();
        if (['nativo', 'native'].includes(key)) return m['skills.native']();
        return level; // Por si se pasa un nivel desconocido
    };
</script>

<!-- Contenedor principal con animación de entrada -->
<div
    class="skill-item mb-4"
    transition:fly={{ x: -30, duration: 500, delay: index * 100, easing: quintOut }}
>
    <!-- Título de la habilidad y etiqueta del nivel -->
    <div class="flex justify-between items-center mb-2">
        <span class="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
        <span
            class="text-sm px-2 py-1 rounded-full text-white font-medium {getLevelColor(skill.level)}"
        >
            {getLevelLabel(skill.level)}
        </span>
    </div>

    <!-- Barra de progreso con color y ancho dinámico -->
    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
            class="h-2 rounded-full transition-all duration-1000 ease-out {getLevelColor(skill.level)}"
            style="width: {getLevelWidth(skill.level)}"
        ></div>
    </div>
</div>
