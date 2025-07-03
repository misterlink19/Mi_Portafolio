<script lang="ts">
  // --- Core Svelte ---
  // onMount: Para ejecutar código una vez que el componente se ha renderizado en el DOM.
  import { onMount } from 'svelte';
  // fly, fade: Transiciones para animar elementos al aparecer o desaparecer.
  import { fly, fade } from 'svelte/transition';
  // quintOut: Una función de easing para transiciones con un efecto de desaceleración.
  import { quintOut } from 'svelte/easing';

  // --- Datos Locales ---
  // personalInfo: Contiene datos como el nombre y la ubicación del portfolio.
  import { personalInfo } from '$lib/data/portfolio.js';

  // --- Internacionalización ---
  // m: Objeto que contiene todos los mensajes traducidos de la aplicación (ej. títulos, descripciones).
  import * as m from '$lib/paraglide/messages';

  // --- Iconos ---
  // Iconos de Lucide Svelte, utilizados por el componente ContactInfoItem.
  import { Mail, MapPin, Linkedin, Github } from '@lucide/svelte';

  // --- Componentes Reutilizables ---
  // ContactInfoItem: Muestra un único punto de contacto (email, ubicación, etc.).
  import ContactInfoItem from '$lib/components/ContactInfoItem.svelte';
  // ContactForm: Encapsula toda la lógica y UI del formulario de contacto.
  import ContactForm from '$lib/components/ContactForm.svelte';

  // --- Variables de Estado Reactivas ($state) ---
  // visibleElements: Un Set que guarda los `data-animate-id` de los elementos que están en el viewport.
  // Permite activar animaciones solo cuando el usuario los ve.
  let visibleElements = $state(new Set<string>());
  // mounted: Un booleano que indica si el componente principal ya se ha montado en el DOM.
  // Es útil para coordinar animaciones iniciales y evitar efectos visuales no deseados.
  let mounted = $state(false);

  // --- Hook `onMount` ---
  // Configura un IntersectionObserver para detectar cuándo los elementos con `data-animate-id`
  // entran en el viewport, y así activar sus animaciones.
  onMount(() => {
    mounted = true; // El componente ya está listo, las animaciones iniciales pueden activarse.

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.animateId;
            if (id) {
              // Añade el ID del elemento visible al Set reactivo.
              visibleElements = new Set([...visibleElements, id]);
            }
          }
        });
      },
      // Opciones del observador: El 10% del elemento debe estar visible para considerarse "intersecting".
      // rootMargin añade un margen de 50px alrededor del viewport para una detección anticipada.
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observa todos los elementos en el DOM que tienen el atributo `data-animate-id`.
    document.querySelectorAll('[data-animate-id]').forEach((el) => observer.observe(el));

    // Función de limpieza: Se ejecuta cuando el componente se destruye para desconectar el observador.
    return () => observer.disconnect();
  });

  // --- Estados Derivados ($derived) para Condiciones de Animación ---
  // Estas variables reactivas simplifican las condiciones `{#if}` en el marcado,
  // haciéndolas más legibles y declarativas.
  const animateHeader = $derived(visibleElements.has('header'));
  const animateContactInfo = $derived(mounted && visibleElements.has('contact-info'));
  const animateAdditionalInfo = $derived(mounted && visibleElements.has('additional-info'));
  const animateContactForm = $derived(mounted && visibleElements.has('contact-form'));

  // --- Clases de Tailwind CSS Reutilizables ---
  // infoCardClasses: Define los estilos comunes para las tarjetas principales de información.
  const infoCardClasses =
    'bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300';
</script>

<svelte:head>
  <title>{m['contact.title']()} - {personalInfo.name}</title>
  <meta name="description" content={m['contact.headerDescription']()} />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
  <div class="text-center mb-16" data-animate-id="header">
    {#if animateHeader}
      <div transition:fade={{ duration: 800, delay: 100 }}>
        <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {m['contact.title']()}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          {m['contact.headerDescription']()}
        </p>
      </div>
    {:else}
      <div class="h-[150px] w-full"></div>
    {/if}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <div class="space-y-8">
      <div data-animate-id="contact-info">
        {#if animateContactInfo}
          <div transition:fly={{ y: 30, duration: 600, delay: 200, easing: quintOut }}>
            <div class="{infoCardClasses}">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {m['contact.infoTitle']()}
              </h2>
              <div class="space-y-6">
                <ContactInfoItem
                  icon={Mail}
                  title={m['contact.email']()}
                  value={personalInfo.email}
                  delay={100}
                  iconBgClass="bg-blue-100 dark:bg-blue-900"
                  iconColorClass="text-blue-600 dark:text-blue-400"
                />
                <ContactInfoItem
                  icon={MapPin}
                  title={m['contact.locationTitle']()}
                  value={personalInfo.location}
                  delay={200}
                  iconBgClass="bg-green-100 dark:bg-green-900"
                  iconColorClass="text-green-600 dark:text-green-400"
                />
                <ContactInfoItem
                  icon={Github}
                  title="GitHub"
                  value="misterlink19"
                  href="https://github.com/misterlink19"
                  delay={300}
                  iconBgClass="bg-gray-100 dark:bg-gray-700"
                  iconColorClass="text-gray-600 dark:text-gray-400"
                />
                <ContactInfoItem
                  icon={Linkedin}
                  title="LinkedIn"
                  value="Amle Martinez Marte"
                  href="https://www.linkedin.com/in/amle-martinez-marte-15a433208/"
                  delay={400}
                  iconBgClass="bg-blue-50 dark:bg-blue-900"
                  iconColorClass="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
          </div>
        {/if}
      </div>

      <div data-animate-id="additional-info">
        {#if animateAdditionalInfo}
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
      {#if animateContactForm}
        <div transition:fly={{ y: 30, duration: 600, delay: 300, easing: quintOut }}>
          <ContactForm />
        </div>
      {/if}
    </div>
  </div>
</div>