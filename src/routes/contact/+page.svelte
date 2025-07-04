<script lang="ts">
  // Importaciones de Svelte para el ciclo de vida del componente y transiciones.
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  // Importación de datos personales (email, ubicación) y mensajes para internacionalización.
  import { personalInfo } from '$lib/data/portfolio.js';
  import * as m from '$lib/paraglide/messages';

  // Importación de iconos desde Lucide Svelte.
  import { Mail, MapPin, Linkedin, Github } from '@lucide/svelte';

  // Importación de componentes reutilizables.
  import ContactInfoItem from '$lib/components/ContactInfoItem.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';

  // --- Variables de Estado Reactivas ---

  /**
   * @type {Set<string>} visibleElements - Un conjunto que almacena los IDs de los elementos
   * que actualmente son visibles en el viewport. Utilizado para controlar cuándo activar
   * las animaciones de entrada basadas en la visibilidad.
   */
  let visibleElements = $state(new Set<string>());

  /**
   * @type {boolean} mounted - Indica si el componente ha sido montado en el DOM.
   * Se usa para asegurar que las animaciones solo se activen después de que el DOM esté listo,
   * evitando animaciones en la carga inicial que puedan causar problemas visuales o de rendimiento.
   */
  let mounted = $state(false);

  /**
   * Hook `onMount`: Se ejecuta una vez que el componente ha sido montado en el DOM.
   * Aquí se inicializa un IntersectionObserver para detectar cuando los elementos con
   * el atributo `data-animate-id` entran en el viewport, activando sus animaciones.
   */
  onMount(() => {
    // Establece `mounted` a `true` una vez que el componente está en el DOM.
    mounted = true;

    // Crea un IntersectionObserver.
    // Este observador monitorea la visibilidad de los elementos en el viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        // Itera sobre cada entrada (elemento observado).
        entries.forEach((entry) => {
          // Si el elemento está intersectando (visible) el viewport.
          if (entry.isIntersecting) {
            // Obtiene el ID de animación del atributo `data-animate-id`.
            const id = (entry.target as HTMLElement).dataset.animateId;
            if (id) {
              // Añade el ID del elemento al conjunto `visibleElements`,
              // lo que desencadena la visualización y animación del elemento.
              visibleElements = new Set([...visibleElements, id]);
            }
          }
        });
      },
      // Opciones del IntersectionObserver:
      // - `threshold: 0.1`: El callback se ejecuta cuando el 10% del elemento es visible.
      // - `rootMargin: '50px'`: Expande el área de intersección en 50px alrededor del viewport.
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observa todos los elementos en el documento que tienen el atributo `data-animate-id`.
    document.querySelectorAll('[data-animate-id]').forEach((el) => observer.observe(el));

    // Función de limpieza: Desconecta el observador cuando el componente se destruye
    // para evitar pérdidas de memoria.
    return () => observer.disconnect();
  });

  /**
   * Clases CSS comunes para las tarjetas de información de contacto.
   * Se definen una vez para reutilización y consistencia.
   */
  const infoCardClasses =
    'bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300';
</script>

<svelte:head>
  <title>{m['contact.title']()} - {personalInfo.name}</title>
  <meta name="description" content={m['contact.headerDescription']()} />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-12">
  <div class="text-center mb-16" data-animate-id="header">
    {#if visibleElements.has('header')}
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
        {#if mounted && visibleElements.has('contact-info')}
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
        {:else}
          <div class="min-h-[450px] w-full lg:min-h-[400px]"></div>
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
                    transition:fade={{ duration: 300, delay: index * 100, easing: quintOut }}
                  >
                    <span class="text-blue-600 dark:text-blue-400 mr-2">✓</span>
                    {benefit}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {:else}
          <div class="min-h-[250px] w-full lg:min-h-[200px]"></div>
        {/if}
      </div>
    </div>

    <div data-animate-id="contact-form">
      {#if mounted && visibleElements.has('contact-form')}
        <div transition:fly={{ y: 30, duration: 600, delay: 300, easing: quintOut }}>
          <ContactForm />
        </div>
      {:else}
        <div class="min-h-[550px] w-full lg:min-h-[500px]"></div>
      {/if}
    </div>
  </div>
</div>