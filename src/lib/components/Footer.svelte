<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
  /**
   * Footer.svelte
   */

  // i18n
  import * as m from '$lib/paraglide/messages';
  import { page } from '$app/state';
  import { getLocale } from '$lib/paraglide/runtime';

  // Datos de usuario y tecnologías
  import { personalInfo } from '$lib/data/portfolio.js';

  // Iconos
  import { Mail, MapPin, Linkedin, Github } from '@lucide/svelte';

  // Reactividad SSR-friendly
  $: currentLocale = page.data.paraglide?.lang || getLocale();

  // Navegación
  const navItems = [
    { href: '/',         label: m['nav.home']    },
    { href: '/about',    label: m['nav.about']   },
    { href: '/projects', label: m['nav.projects']},
    { href: '/contact',  label: m['nav.contact'] }
  ];

  // Tecnologías con logo y enlace
  const usedTech = [
    {
      name: 'SvelteKit',
      logo: '/icons/svelte.svg',
      link: 'https://kit.svelte.dev/'
    },
    {
      name: 'Tailwind CSS',
      logo: '/icons/tailwind.svg',
      link: 'https://tailwindcss.com/docs/installation/framework-guides/sveltekit'
    },
    {
      name: 'Paraglide.js',
      logo: '/icons/paraglide.svg', 
      link: 'https://inlang.com/m/gerre34r/library-inlang-paraglideJs'
    }
  ];
</script>

<footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

      <!-- 1. Navegación -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
          {m['nav.home']()}
        </h3>
        <nav class="space-y-2">
          {#each navItems as item}
            <a
              href={item.href}
              class="block text-gray-600 dark:text-gray-400
                     hover:text-blue-600 dark:hover:text-blue-400
                     transition-colors"
            >
              {item.label()}
            </a>
          {/each}
        </nav>
      </div>

      <!-- 2. Contacto + RRSS -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
          {m['contact.title']()}
        </h3>
        <div class="space-y-2">
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Mail class="w-6 h-6 flex-shrink-0" />
            <span>{personalInfo.email}</span>
          </div>
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <MapPin class="w-6 h-6 flex-shrink-0" />
            <span>{personalInfo.location}</span>
          </div>
          <div class="flex items-center space-x-4 mt-2">
            <!-- GitHub -->
            <a
              href="https://github.com/misterlink19"
              target="_blank"
              aria-label="Enlace a github"
              rel="noopener"
              class="text-gray-600 dark:text-gray-400
                     hover:text-gray-900 dark:hover:text-white
                     transition-colors"
            >
              <Github
                class="w-6 h-6 transition-transform transform
                       hover:scale-110"
              />
            </a>

            <!-- LinkedIn -->
            <a
              href="https://www.linkedin.com/in/amle-martinez-marte-15a433208/"
              target="_blank"
              rel="noopener"
              aria-label="Enlace a linkedin"
              class="text-gray-600 dark:text-gray-400
                     hover:text-blue-700 dark:hover:text-blue-300
                     transition-colors"

            >
              <Linkedin
                class="w-6 h-6 transition-transform transform
                       hover:scale-110"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- 3. Tecnología usada -->
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
          Tecnología
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {m['footer.builtWith']()}
        </p>

        <div class="flex items-center space-x-6">
          {#each usedTech as tech}
            <a
              href={tech.link}
              target="_blank"
              rel="noopener"
              class="flex flex-col items-center
                     text-gray-600 dark:text-gray-400
                     group"
            >
              <img
                src={tech.logo}
                alt="{tech.name} logo"
                class="w-8 h-8 mb-1 transition-transform transform
                       group-hover:scale-110"
              />
              <span class="text-xs">{tech.name}</span>
            </a>
          {/each}
        </div>
      </div>

    </div>

    <!-- Derechos de autor -->
    <div
      class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700
             text-center text-gray-600 dark:text-gray-400"
    >
      <p>{m['footer.copyright']()}</p>
    </div>
  </div>
</footer>
