<script lang="ts">
  /**
   * Footer.svelte
   * Pie de página con:
   * - Navegación
   * - Contacto
   * - Tecnologías usadas (solo SvelteKit, Tailwind CSS y Paraglide.js)
   * - Soporte i18n con Paraglide.js
   */

  // 1) Paraglide.js: mensajes y runtime
  import * as m from '$lib/paraglide/messages';
  import { page } from '$app/stores';
  import { getLocale } from '$lib/paraglide/runtime';

  // 2) Datos personales y logos de todas las tecnologías
  import { personalInfo, technologies } from '$lib/data/portfolio.js';

  // 3) Iconos estándar
  import { Mail, MapPin } from '@lucide/svelte';

  // 4) Locale reactive (SSR-friendly)
  $: currentLocale = $page.data.paraglide?.lang || getLocale();

  // 5) Items de navegación
  const navItems = [
    { href: '/',         label: m['nav.home']    },
    { href: '/about',    label: m['nav.about']   },
    { href: '/projects', label: m['nav.projects']},
    { href: '/contact',  label: m['nav.contact'] }
  ];

  // 6) Tecnologías que realmente mostramos en el footer
  //    Sólo SvelteKit, Tailwind CSS y Paraglide.js
  const usedTech = [
    {
      name: 'SvelteKit',
      logo: technologies.find(t => t.name.includes('Svelte'))?.logo
    },
    {
      name: 'Tailwind CSS',
      logo: technologies.find(t => t.name.includes('Tailwind'))?.logo
    },
    {
      name: 'Paraglide.js',
      // Asumimos que tienes un SVG en /icons/paraglide.svg
      logo: '/icons/paraglide.svg'
    }
  ];
</script>

<footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

      <!-- 1. Navegación -->
      <div>
        {#key currentLocale}
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
            {m['nav.home']()}
          </h3>
        {/key}
        <nav class="space-y-2">
          {#each navItems as item}
            <a
              href={item.href}
              class="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {#key currentLocale}{item.label()}{/key}
            </a>
          {/each}
        </nav>
      </div>

      <!-- 2. Contacto -->
      <div>
        {#key currentLocale}
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
            {m['contact.title']()}
          </h3>
        {/key}
        <div class="space-y-2">
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Mail class="w-6 h-6 flex-shrink-0" />
            <span>{personalInfo.email}</span>
          </div>
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <MapPin class="w-6 h-6 flex-shrink-0" />
            <span>{personalInfo.location}</span>
          </div>
        </div>
      </div>

      <!-- 3. Tecnología -->
      <div>
        {#key currentLocale}
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
            Tecnología
          </h3>
        {/key}

        {#key currentLocale}
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {m['footer.builtWith']()}
          </p>
        {/key}

        <!-- Solo los logos de SvelteKit, Tailwind CSS y Paraglide.js -->
        <div class="flex items-center space-x-6">
          {#each usedTech as tech}
            {#if tech.logo}
              <div class="flex flex-col items-center text-gray-600 dark:text-gray-400">
                <img
                  src={tech.logo}
                  alt={tech.name + ' logo'}
                  class="w-8 h-8 mb-1"
                />
                <span class="text-xs">{tech.name}</span>
              </div>
            {/if}
          {/each}
        </div>
      </div>

    </div>

    <!-- Derechos de autor -->
    <div
      class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400"
    >
      {#key currentLocale}
        <p>{m['footer.copyright']()}</p>
      {/key}
    </div>
  </div>
</footer>
