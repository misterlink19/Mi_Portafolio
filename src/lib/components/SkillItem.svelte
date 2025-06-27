<!-- src/lib/components/SkillItem.svelte -->
<script lang="ts">
	/**
	 * Componente visual para mostrar una habilidad con su nivel correspondiente.
	 * Soporta diferentes variantes de visualización:
	 * - 'default': Nombre de la habilidad, nivel y barra de progreso (para habilidades técnicas/lenguajes).
	 * - 'logo-tech': Logo y nombre de la tecnología (para la sección "Tecnologías que manejo").
	 * - 'list-item': Icono de check y nombre (para habilidades blandas/hobbies).
	 *
	 * - Usa Paraglide para traducir los niveles.
	 * - Usa animación `fly` con easing personalizado.
	 * - Adapta el color y ancho del progreso según el nivel.
	 */

	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import * as m from '$lib/paraglide/messages';

	// Definición de la estructura de la habilidad, ahora incluyendo `logo` opcional
	interface SkillData {
		name: string; // El nombre ya puede venir traducido o ser una clave para traducir
		level?: string; // Nivel (ej. 'Experto', 'Intermedio'), opcional
		logo?: string; // Ruta al logo, opcional
	}

	// Props esperadas del componente, con la nueva prop `variant`
	interface Props {
		skill: SkillData;
		index?: number; // Para el delay de animación
		variant?: 'default' | 'logo-tech' | 'list-item'; // Nueva prop para controlar el layout
	}

	// Desestructuración de props con valor predeterminado para index y variant
	let { skill, index = 0, variant = 'default' }: Props = $props();

	/**
	 * Devuelve la clase de color según el nivel para la barra de progreso.
	 */
	const getLevelColor = (level: string = ''): string => {
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
				return 'bg-gray-500'; // Fallback
		}
	};

	/**
	 * Devuelve el ancho proporcional del progreso según el nivel.
	 */
	const getLevelWidth = (level: string = ''): string => {
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
				return '0%'; // Fallback
		}
	};

	/**
	 * Traduce el nivel al idioma activo con Paraglide.
	 * Se asegura de llamar a las funciones de mensaje usando la notación de corchetes.
	 */
	const getLevelLabel = (level: string = ''): string => {
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
	{#if variant === 'logo-tech'}
		<!-- Variante para mostrar logo y nombre de la tecnología -->
		<div
			class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 text-center flex flex-col items-center justify-center h-full"
		>
			{#if skill.logo}
				<img src={skill.logo} alt={skill.name} class="w-16 h-16 object-contain mb-4" />
			{:else}
				<!-- Placeholder si no hay logo -->
				<div
					class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4"
				>
					<span class="text-gray-500 dark:text-gray-400 text-xs">No Logo</span>
				</div>
			{/if}
			<span class="text-gray-700 dark:text-gray-300 font-semibold text-lg">{skill.name}</span>
		</div>
	{:else if variant === 'list-item'}
		<!-- Variante para elementos de lista (habilidades blandas, hobbies) con un ícono de check -->
		<li class="flex items-center text-gray-700 dark:text-gray-300">
			<svg
				class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
				></path>
			</svg>
			<span class="font-medium text-lg">{skill.name}</span>
		</li>
	{:else}
		<!-- Variante por defecto: Nombre de la habilidad, nivel y barra de progreso -->
		<div class="flex justify-between items-center mb-2">
			<span class="text-gray-700 dark:text-gray-300 font-medium text-lg">{skill.name}</span>
			<span
				class="text-sm px-3 py-1 rounded-full text-white font-medium {getLevelColor(skill.level)}"
			>
				{getLevelLabel(skill.level)}
			</span>
		</div>

		<!-- Barra de progreso con color y ancho dinámico -->
		<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
			<div
				class="h-3 rounded-full transition-all duration-1000 ease-out {getLevelColor(skill.level)}"
				style="width: {getLevelWidth(skill.level)}"
			></div>
		</div>
	{/if}
</div>
