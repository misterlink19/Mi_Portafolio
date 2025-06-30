<!-- src/routes/about/+page.svelte -->
<script lang="ts">
	/**
	 * Página "Acerca de mí" del portafolio.
	 *
	 * Muestra información personal, habilidades técnicas, experiencia laboral,
	 * formación académica, habilidades blandas, hobbies y certificaciones.
	 * Utiliza animaciones de entrada basadas en la visibilidad del scroll
	 * e internacionalización para los textos.
	 */

	// Importaciones de Svelte para ciclo de vida y transiciones.
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	// Store de SvelteKit para acceder a datos de la página (e.g., idioma).
	import { page } from '$app/state';

	// Importación de datos del portafolio (información personal, habilidades, experiencia, etc.).
	import {
		personalInfo,
		technologies,
		workExperience,
		education,
		skills
	} from '$lib/data/portfolio.js';
	// Componentes reutilizables.
	import SkillItem from '$lib/components/SkillItem.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	// Librería de mensajes de Paraglide.js para internacionalización.
	import * as m from '$lib/paraglide/messages';
	// Iconos de Lucide Svelte.
	import { Mail, MapPin } from '@lucide/svelte';

	/**
	 * @type {string} lang - Idioma actual de la página, obtenido de los datos de SvelteKit
	 * o por defecto 'es'. Utilizado para seleccionar textos traducidos directamente de `personalInfo`.
	 */
	const lang = page.data.paraglide?.lang || 'es';

	/**
	 * Función utilitaria para obtener un mensaje traducido de Paraglide.js.
	 * Se asegura de que la clave exista y sea una función antes de llamarla.
	 * @param {string} key - La clave del mensaje a traducir (ej. 'nav.home').
	 * @returns {string} El mensaje traducido o la clave si no se encuentra.
	 */
	function getMessage(key: string): string {
		const messageFunction = (m as any)[key];
		if (typeof messageFunction === 'function') {
			return messageFunction();
		}
		console.warn(`Mensaje no encontrado o no es una función para la clave: "${key}"`);
		return key;
	}

	/**
	 * @type {boolean} mounted - Bandera reactiva que indica si el componente se ha montado en el DOM.
	 * Se usa para activar animaciones después de un breve retraso.
	 */
	let mounted = $state(false);
	/**
	 * @type {Set<string>} visibleElements - Conjunto reactivo que almacena los IDs de los elementos
	 * del DOM que están actualmente visibles en el viewport. Utilizado para disparar animaciones.
	 */
	let visibleElements = $state(new Set<string>());

	/**
	 * Hook `onMount`: Se ejecuta cuando el componente está en el DOM.
	 * Configura un `IntersectionObserver` para detectar la visibilidad de los elementos
	 * con `data-animate-id` y añadirlos a `visibleElements`, activando sus transiciones.
	 */
	onMount(() => {
		setTimeout(() => {
			mounted = true;
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const id = (entry.target as HTMLElement).dataset.animateId;
							if (id) {
								visibleElements.add(id);
								visibleElements = new Set(visibleElements); // Activar reactividad
							}
						}
					});
				},
				{ threshold: 0.1, rootMargin: '50px' } // Detecta con el 10% del elemento visible
			);

			document
				.querySelectorAll<HTMLElement>('[data-animate-id]')
				.forEach((el) => observer.observe(el));
			return () => observer.disconnect(); // Limpieza del observador
		}, 100); // Pequeño retraso para asegurar que el DOM esté listo
	});

	// --- Procesamiento de datos para los componentes Timeline y SkillItem ---
	// Adapta los datos de experiencia laboral para el componente `Timeline`.
	const processedWorkExperience = workExperience.map((item, index) => ({
		id: `work-item-${item.id || index}`,
		type: 'work' as const,
		company: item.company,
		position: getMessage(item.positionKey),
		description: getMessage(item.descriptionKey),
		startYear: item.startYear,
		endYear: item.endYear,
		technologies: item.technologies
	}));

	// Adapta los datos de educación para el componente `Timeline`.
	const processedEducation = education.map((item, index) => ({
		id: `edu-item-${item.id || index}`,
		type: 'education' as const,
		institution: item.institution,
		degree: getMessage(item.degreeKey),
		description: getMessage(item.descriptionKey),
		startYear: item.startYear,
		endYear: item.endYear
	}));

	// Adapta las habilidades técnicas para el componente `SkillItem`.
	const processedTechnicalSkillsForDisplay = skills.technical.map((skill) => ({
		name: getMessage(skill.nameKey),
		level: skill.level
	}));

	// Adapta las habilidades de idiomas para el componente `SkillItem`.
	const processedLanguageSkillsForDisplay = skills.languages.map((skill) => ({
		name: getMessage(skill.nameKey),
		level: skill.level
	}));
</script>

<svelte:head>
	<!-- Establece el título de la página y la meta descripción para SEO -->
	<title>{personalInfo.name} - {m['nav.about']()}</title>
	<meta name="description" content={m['home.CV']()} />
</svelte:head>

<!-- Contenedor principal de la página con estilos de espaciado y fuente -->
<div class="container mx-auto p-4 md:p-8 font-inter antialiased text-gray-900 dark:text-white">
	<!-- Sección del encabezado principal de la página "Acerca de mí" -->
	<div class="text-center mb-16" data-animate-id="about-header">
		{#if mounted && visibleElements.has('about-header')}
			<!-- Título animado cuando es visible -->
			<div transition:fade={{ duration: 800, delay: 100 }}>
				<h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
					{m['nav.about']()}
				</h1>
			</div>
		{:else}
			<!-- Título de marcador de posición invisible antes de la animación -->
			<h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 opacity-0">
				{m['nav.about']()}
			</h1>
		{/if}
	</div>

	<!-- Sección de Información Personal y Tecnologías Manejadas -->
	<section class="mb-16">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
			<!-- Tarjeta de Información Personal -->
			<div data-animate-id="personal-info-card">
				{#if mounted && visibleElements.has('personal-info-card')}
					<div transition:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }}>
						<div
							class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center border border-gray-200 dark:border-gray-700"
						>
							<!-- Foto de perfil -->
							<img
								src={personalInfo.photo}
								alt={personalInfo.name}
								class="w-40 h-40 rounded-full mx-auto mb-6 object-cover shadow-lg border-4 border-blue-500"
								style="object-position: top center;"
							/>
							<!-- Nombre y Título/Profesión -->
							<h1
								class="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight"
							>
								{personalInfo.name}
							</h1>
							<h2 class="text-xl lg:text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-6">
								{personalInfo.title}
							</h2>
							<!-- CV personal (traducido) -->
							<p class="text-lg text-justify text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
								{m['home.CV']()}
							</p>
							<!-- Información de contacto básica (email y ubicación) -->
							<div class="flex justify-center space-x-6 mt-auto">
								<a
									href={`mailto:${personalInfo.email}`}
									class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-lg flex items-center transition-colors"
								>
									<Mail class="w-6 h-6 mr-2" />
									{personalInfo.email}
								</a>
								<span class="text-gray-500 dark:text-gray-400 text-lg">|</span>
								<span class="text-gray-500 dark:text-gray-400 text-lg flex items-center">
									<MapPin class="w-6 h-6 mr-2" />
									{personalInfo.location}
								</span>
							</div>
						</div>
					</div>
				{:else}
					<!-- Marcador de posición animado mientras carga la tarjeta de información personal -->
					<div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 h-[400px] animate-pulse"></div>
				{/if}
			</div>

			<!-- Tarjeta de Tecnologías Manejadas -->
			<div data-animate-id="technologies-card">
				{#if mounted && visibleElements.has('technologies-card')}
					<div transition:fly={{ y: 30, duration: 600, delay: 400, easing: quintOut }}>
						<div
							class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col border border-gray-200 dark:border-gray-700"
						>
							<h3
								class="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center border-b-2 border-blue-500 pb-4"
							>
								{m['section.technologies']()}
							</h3>
							<!-- Grid para mostrar logos y nombres de tecnologías -->
							<div
								class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 flex-grow"
							>
								{#each technologies as tech, index}
									<div
										class="text-center hover:scale-105 transition-transform duration-300"
										transition:fly={{ y: 20, duration: 400, delay: index * 100, easing: quintOut }}
									>
										<!-- Logo de la tecnología o un placeholder -->
										<img
											src={tech.logo || '/placeholder.svg'}
											alt={tech.name}
											class="w-12 h-12 mx-auto mb-2 object-contain"
										/>
										<!-- Nombre y nivel de la tecnología -->
										<p class="text-sm text-gray-600 dark:text-gray-400">{tech.name}</p>
										<p class="text-xs text-blue-600 dark:text-blue-400 font-medium">
											{m[tech.level]()}
										</p>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<!-- Marcador de posición animado mientras carga la tarjeta de tecnologías -->
					<div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 h-[400px] animate-pulse"></div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Sección de Experiencia Laboral -->
	<section class="mb-16">
		<h2
			class="text-5xl font-bold text-gray-800 dark:text-white mb-8 text-center"
			data-animate-id="work-experience-title"
		>
			{#if mounted && visibleElements.has('work-experience-title')}
				<!-- Título animado de la sección -->
				<span transition:fade={{ duration: 600, delay: 100 }}>{m['section.workExperience']()}</span>
			{:else}
				<!-- Título de marcador de posición invisible -->
				<span class="opacity-0">{m['section.workExperience']()}</span>
			{/if}
		</h2>
		<!-- Componente Timeline para la experiencia laboral -->
		<Timeline items={processedWorkExperience} type="work" />
	</section>

	<!-- Sección de Educación -->
	<section class="mb-16">
		<h2
			class="text-5xl font-bold text-gray-800 dark:text-white mb-8 text-center"
			data-animate-id="education-title"
		>
			{#if mounted && visibleElements.has('education-title')}
				<!-- Título animado de la sección -->
				<span transition:fade={{ duration: 600, delay: 100 }}>{m['section.education']()}</span>
			{:else}
				<!-- Título de marcador de posición invisible -->
				<span class="opacity-0">{m['section.education']()}</span>
			{/if}
		</h2>
		<!-- Componente Timeline para la educación -->
		<Timeline items={processedEducation} type="education" />
	</section>

	<!-- Sección de Habilidades (Técnicas, Idiomas, Blandas, Hobbies y Certificaciones) -->
	<section class="mb-12">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
			<!-- Tarjeta de Habilidades Técnicas -->
			<div data-animate-id="technical-skills-card">
				{#if mounted && visibleElements.has('technical-skills-card')}
					<div transition:fly={{ y: 30, duration: 600, delay: 100, easing: quintOut }}>
						<div
							class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
						>
							<h3
								class="text-2xl font-semibold text-gray-800 dark:text-white mb-5 border-b-2 border-blue-500 pb-2"
							>
								{m['section.technicalSkills']()}
							</h3>
							<!-- Lista de SkillItem para habilidades técnicas -->
							<ul class="list-none text-gray-700 dark:text-gray-300 space-y-4">
								{#each processedTechnicalSkillsForDisplay as skill, i}
									<SkillItem {skill} index={i} variant="default" />
								{/each}
							</ul>
						</div>
					</div>
				{:else}
					<!-- Marcador de posición animado para habilidades técnicas -->
					<div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 h-[300px] animate-pulse"></div>
				{/if}
			</div>

		

			<!-- Tarjeta de Certificaciones (ocupa 2 columnas en md y lg) -->
			<div class="md:col-span-2" data-animate-id="certificates-card">
				{#if mounted && visibleElements.has('certificates-card')}
					<div transition:fly={{ y: 30, duration: 600, delay: 500, easing: quintOut }}>
						<div
							class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
						>
							<h3
								class="text-2xl font-semibold text-gray-800 dark:text-white mb-5 border-b-2 border-blue-500 pb-2"
							>
								{m['section.certificates']()}
							</h3>
							<!-- Lista de certificaciones -->
							<ul class="list-none text-gray-700 dark:text-gray-300 space-y-4">
								{#each skills.certificates as cert, index}
									<li
										class="border-l-4 border-yellow-500 pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors duration-200"
										transition:fly={{ x: -20, duration: 400, delay: index * 50, easing: quintOut }}
									>
										<h4 class="font-semibold text-gray-900 dark:text-white text-lg">
											{getMessage(cert.nameKey)}
										</h4>
										<p class="text-gray-600 dark:text-gray-400 text-base">
											{getMessage(cert.issuerKey)} - {cert.date}
										</p>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{:else}
					<!-- Marcador de posición animado para certificaciones -->
					<div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 h-[250px] animate-pulse"></div>
				{/if}
			</div>
				<!-- Tarjeta de Idiomas -->
			<div data-animate-id="languages-card">
				{#if mounted && visibleElements.has('languages-card')}
					<div transition:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }}>
						<div
							class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
						>
							<h3
								class="text-2xl font-semibold text-gray-800 dark:text-white mb-5 border-b-2 border-blue-500 pb-2"
							>
								{m['section.languages']()}
							</h3>
							<!-- Lista de SkillItem para idiomas -->
							<ul class="list-none text-gray-700 dark:text-gray-300 space-y-4">
								{#each processedLanguageSkillsForDisplay as langSkill, i}
									<SkillItem skill={langSkill} index={i} variant="default" />
								{/each}
							</ul>
						</div>
					</div>
				{:else}
					<!-- Marcador de posición animado para idiomas -->
					<div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 h-[300px] animate-pulse"></div>
				{/if}
			</div>

			<!-- Tarjeta de Habilidades Blandas (Soft Skills) -->
			<div data-animate-id="soft-skills-card">
				{#if mounted && visibleElements.has('soft-skills-card')}
					<div transition:fly={{ y: 30, duration: 600, delay: 300, easing: quintOut }}>
						<div
							class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
						>
							<h3
								class="text-2xl font-semibold text-gray-800 dark:text-white mb-5 border-b-2 border-blue-500 pb-2"
							>
								{m['section.softSkills']()}
							</h3>
							<!-- Etiquetas para habilidades blandas -->
							<div class="flex flex-wrap gap-2">
								{#each skills.soft as skillKey, index}
									<span
										class="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-lg font-medium hover:scale-105 transition-transform duration-200"
										transition:fly={{ x: -20, duration: 400, delay: index * 50, easing: quintOut }}
									>
										{getMessage(skillKey)}
									</span>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<!-- Marcador de posición animado para habilidades blandas -->
					<div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 h-[200px] animate-pulse"></div>
				{/if}
			</div>

			<!-- Tarjeta de Hobbies -->
			<div data-animate-id="hobbies-card">
				{#if mounted && visibleElements.has('hobbies-card')}
					<div transition:fly={{ y: 30, duration: 600, delay: 400, easing: quintOut }}>
						<div
							class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
						>
							<h3
								class="text-2xl font-semibold text-gray-800 dark:text-white mb-5 border-b-2 border-blue-500 pb-2"
							>
								{m['section.hobbies']()}
							</h3>
							<!-- Etiquetas para hobbies -->
							<div class="flex flex-wrap gap-2">
								{#each skills.hobbies as hobbyKey, index}
									<span
										class="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-lg font-medium hover:scale-105 transition-transform duration-200"
										transition:fly={{ x: -20, duration: 400, delay: index * 50, easing: quintOut }}
									>
										{getMessage(hobbyKey)}
									</span>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<!-- Marcador de posición animado para hobbies -->
					<div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 h-[200px] animate-pulse"></div>
				{/if}
			</div>
		</div>
	</section>
</div>
