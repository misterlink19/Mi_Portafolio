<script lang="ts">
	// Transiciones de Svelte para animar la entrada del elemento.
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	// Tipos para asegurar que el 'icon' sea un componente de Lucide Svelte válido.
	import type { Component } from 'svelte';
	import type { IconProps } from '@lucide/svelte';

	// --- Propiedades del Componente ($props) ---
	// Recibe la información para mostrar un ítem de contacto.
	let {
		icon: IconComponent, // El componente de icono de Lucide Svelte (ej. Mail, Github).
		title, // Título principal (ej. "Email").
		value, // El valor asociado (ej. la dirección de correo).
		href, // URL opcional si el ítem es un enlace (ej. para GitHub).
		delay, // Retraso para la animación de entrada.
		iconBgClass, // Clases de Tailwind para el color de fondo del icono.
		iconColorClass // Clases de Tailwind para el color del icono.
	} = $props<{
		icon: Component<IconProps>;
		title: string;
		value: string;
		href?: string;
		delay: number;
		iconBgClass: string;
		iconColorClass: string;
	}>();

	// --- Clases de Tailwind Reutilizables ---
	// Definen la apariencia base del ítem y el icono.
	const baseClasses =
		'flex items-center space-x-4 hover:scale-105 transition-transform duration-200';
	const iconWrapperClasses = 'p-3 rounded-lg'; // Contenedor del icono con fondo.
	const iconSizeClasses = 'w-6 h-6'; // Tamaño del icono.
</script>

<div class={baseClasses} transition:fly={{ x: -20, duration: 400, delay: delay, easing: quintOut }}>
	<div class="{iconWrapperClasses} {iconBgClass}">
		<IconComponent class="{iconSizeClasses} {iconColorClass}" />
	</div>
	<div>
		{#if href}
			<a
				{href}
				target="_blank"
				rel="noopener"
				class="font-semibold text-gray-900 dark:text-white hover:underline"
			>
				{title}
			</a>
			<p class="text-gray-600 dark:text-gray-400">{value}</p>
		{:else}
			<h3 class="font-semibold text-gray-900 dark:text-white">
				{title}
			</h3>
			<p class="text-gray-600 dark:text-gray-400">{value}</p>
		{/if}
	</div>
</div>
