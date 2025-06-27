<script lang="ts">
	/**
	 * Página de contacto del portafolio.
	 *
	 * Permite a los visitantes enviar un mensaje a través de un formulario
	 * y muestra información de contacto alternativa. Incluye validación de formulario,
	 * manejo de estado de envío y animaciones de entrada.
	 */

	// Importaciones de Svelte para ciclo de vida y transiciones.
	import { onMount } from 'svelte';
	import { fly, scale, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	// Importación de datos personales para mostrar email y ubicación.
	import { personalInfo } from '$lib/data/portfolio.js';
	// Librería de mensajes de Paraglide.js para internacionalización.
	import * as m from '$lib/paraglide/messages';
	// Iconos de Lucide Svelte.
	import { Mail, MapPin, Send } from '@lucide/svelte';

	// --- Variables de Estado Reactivas ---
	/**
	 * @type {Set<string>} visibleElements - IDs de los elementos visibles en el viewport.
	 * Controla las animaciones de entrada.
	 */
	let visibleElements = $state(new Set<string>());
	/**
	 * @type {boolean} mounted - Indica si el componente ya está montado en el DOM.
	 * Utilizado para retrasar la activación de animaciones.
	 */
	let mounted = $state(false);
	/**
	 * @type {object} formData - Almacena los valores de los campos del formulario.
	 */
	let formData = $state({
		name: '',
		email: '',
		message: ''
	});
	/**
	 * @type {Record<string, string>} errors - Almacena los mensajes de error de validación por campo.
	 */
	let errors = $state<Record<string, string>>({});
	/**
	 * @type {boolean} isSubmitting - Indica si el formulario se está enviando.
	 * Deshabilita el botón de envío y muestra un spinner.
	 */
	let isSubmitting = $state(false);
	/**
	 * @type {boolean} showSuccess - Indica si se debe mostrar el mensaje de éxito tras un envío.
	 */
	let showSuccess = $state(false);

	/**
	 * Hook `onMount`: Se ejecuta cuando el componente se monta en el DOM.
	 * Inicializa el IntersectionObserver para controlar las animaciones de entrada
	 * de los elementos con el atributo `data-animate-id`.
	 */
	onMount(() => {
		setTimeout(() => {
			mounted = true; // Componente montado, permite que las animaciones se activen
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
			const elements = document.querySelectorAll('[data-animate-id]');
			elements.forEach((el) => observer.observe(el));

			return () => observer.disconnect(); // Limpia el observador al destruir el componente
		}, 100); // Pequeño retraso para asegurar que el DOM esté renderizado
	});

	/**
	 * Valida los campos del formulario.
	 * Actualiza la variable `errors` con los mensajes de error correspondientes.
	 * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
	 */
	function validateForm() {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = m['contact.nameRequired']();
		}
		if (!formData.email.trim()) {
			newErrors.email = m['contact.emailRequired']();
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = m['contact.emailInvalid']();
		}
		if (!formData.message.trim()) {
			newErrors.message = m['contact.messageRequired']();
		}

		errors = newErrors; // Actualiza el estado de errores
		return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
	}

	/**
	 * Maneja el envío del formulario.
	 * Previene el comportamiento por defecto, valida los campos, simula un envío
	 * asíncrono y muestra un mensaje de éxito.
	 * @param {Event} event - El evento de envío del formulario.
	 */
	async function handleSubmit(event: Event) {
		event.preventDefault(); // Evita la recarga de la página

		if (!validateForm()) {
			return; // Detiene el envío si la validación falla
		}

		isSubmitting = true; // Activa el estado de envío

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula un retraso de red

			// Restablece el formulario y muestra el mensaje de éxito
			formData = { name: '', email: '', message: '' };
			errors = {}; // Limpia cualquier error anterior
			showSuccess = true;

			// Oculta el mensaje de éxito después de 5 segundos
			setTimeout(() => {
				showSuccess = false;
			}, 5000);
		} catch (error) {
			console.error('Error al enviar el formulario:', error);
			// Si hubiera un error real de backend, podrías mostrarlo al usuario
			// errors = { general: m['contact.errorMessage']() };
		} finally {
			isSubmitting = false; // Desactiva el estado de envío
		}
	}
</script>

<svelte:head>
	<title>{m['contact.title']()} - {personalInfo.name}</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
	<div class="text-center mb-16" data-animate-id="header">
		{#if mounted && visibleElements.has('header')}
			<div transition:fade={{ duration: 800, delay: 100 }}>
				<h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
					{m['contact.title']()}
				</h1>
				<p class="text-xl text-gray-600 dark:text-gray-400">
					{m['contact.headerDescription']()}
				</p>
			</div>
		{/if}
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
		<div class="space-y-8">
			<div data-animate-id="contact-info">
				{#if mounted && visibleElements.has('contact-info')}
					<div transition:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }}>
						<div
							class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
						>
							<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
								{m['contact.infoTitle']()}
							</h2>
							<div class="space-y-6">
								<div
									class="flex items-center space-x-4 hover:scale-105 transition-transform duration-200"
									transition:fly={{ x: -20, duration: 400, delay: 100, easing: quintOut }}
								>
									<div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
										<Mail class="w-6 h-6 text-blue-600 dark:text-blue-400" />
									</div>
									<div>
										<h3 class="font-semibold text-gray-900 dark:text-white">
											{m['contact.email']()}
										</h3>
										<p class="text-gray-600 dark:text-gray-400">{personalInfo.email}</p>
									</div>
								</div>
								<div
									class="flex items-center space-x-4 hover:scale-105 transition-transform duration-200"
									transition:fly={{ x: -20, duration: 400, delay: 200, easing: quintOut }}
								>
									<div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
										<MapPin class="w-6 h-6 text-green-600 dark:text-green-400" />
									</div>
									<div>
										<h3 class="font-semibold text-gray-900 dark:text-white">
											{m['contact.locationTitle']()}
										</h3>
										<p class="text-gray-600 dark:text-gray-400">{personalInfo.location}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div data-animate-id="additional-info">
				{#if mounted && visibleElements.has('additional-info')}
					<div transition:fly={{ y: 20, duration: 500, delay: 400, easing: quintOut }}>
						<div
							class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300"
						>
							<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
								{m['contact.whyWorkWithMe']()}
							</h3>
							<ul class="space-y-3 text-gray-700 dark:text-gray-300">
								{#each [m['contact.benefit1'](), m['contact.benefit2'](), m['contact.benefit3'](), m['contact.benefit4']()] as benefit, index}
									<li
										class="flex items-start hover:translate-x-2 transition-transform duration-200"
										transition:fly={{ x: -10, duration: 300, delay: index * 100, easing: quintOut }}
									>
										<span class="text-blue-600 dark:text-blue-400 mr-2">✓</span>
										{benefit}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<div data-animate-id="contact-form">
			{#if mounted && visibleElements.has('contact-form')}
				<div transition:fly={{ y: 30, duration: 600, delay: 300, easing: quintOut }}>
					<div
						class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
					>
						{#if showSuccess}
							<div
								class="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200"
								transition:scale={{ duration: 400, easing: quintOut }}
							>
								<p class="font-medium">{m['contact.success']()}</p>
							</div>
						{/if}

						<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
							{m['contact.title']()}
						</h2>

						<form onsubmit={handleSubmit} class="space-y-6">
							<div>
								<label
									for="name"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									{m['contact.name']()}
								</label>
								<input
									type="text"
									id="name"
									name="name"
									bind:value={formData.name}
									class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
									class:border-red-500={errors.name}
								/>
								{#if errors.name}
									<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
								{/if}
							</div>

							<div>
								<label
									for="email"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									{m['contact.email']()}
								</label>
								<input
									type="email"
									id="email"
									name="email"
									bind:value={formData.email}
									class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
									class:border-red-500={errors.email}
								/>
								{#if errors.email}
									<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
								{/if}
							</div>

							<div>
								<label
									for="message"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
								>
									{m['contact.message']()}
								</label>
								<textarea
									id="message"
									name="message"
									rows="5"
									bind:value={formData.message}
									class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
									class:border-red-500={errors.message}
								></textarea>
								{#if errors.message}
									<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
								{/if}
							</div>

							<button
								type="submit"
								class="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
								class:opacity-50={isSubmitting}
								disabled={isSubmitting}
							>
								{#if isSubmitting}
									<svg
										class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									{m['contact.sending']()}
								{:else}
									<Send class="w-5 h-5 mr-2" />
									{m['contact.send']()}
								{/if}
							</button>
							{#if errors.general}
								<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.general}</p>
							{/if}
						</form>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
