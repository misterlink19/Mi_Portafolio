<!-- src/lib/components/Header.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { theme, toggleTheme } from '$lib/stores/theme';
  import { locales, getLocale } from '$lib/paraglide/runtime';
  import * as m from '$lib/paraglide/messages';
  import { Moon, Sun, Globe, Menu, X } from '@lucide/svelte';

  let mobileMenuOpen = false;

  // 1) Reactivos: ruta y locale real
  $: currentPath   = $page.url.pathname;   // "/about" o "/en/about"
  $: currentLocale = getLocale();          // "es" o "en"
  // 2) Base path sin prefijo
  $: basePath      = currentPath.replace(`/${currentLocale}`, '') || '/';

  // Debug: traza cada cambio
  $: console.log(
    '%c[Header]',
    'color:teal;font-weight:bold',
    { currentPath, currentLocale, basePath }
  );

  // 3) Helper para generar href con siempre prefijo
  function hrefWithLocale(path: string, locale: string) {
    // asegúrate de tener slash correcto:
    // path = "/", "/about", etc.
    return `/${locale}${path}`;
  }

  // 4) Menú de ruta “base” (sin prefijo)
  interface NavItem { href: string; label: () => string }
  const navItems: NavItem[] = [
    { href: '/',         label: m['nav.home']    },
    { href: '/about',    label: m['nav.about']   },
    { href: '/projects', label: m['nav.projects']},
    { href: '/contact',  label: m['nav.contact'] }
  ];

  /** Cambio de idioma: construye la URL con prefijo y recarga completa */
  function toggleLanguage() {
    const idx  = locales.indexOf(currentLocale);
    const next = locales[(idx + 1) % locales.length];
    const newHref = hrefWithLocale(basePath, next);
    console.log(
      '%c[Header.toggleLanguage]',
      'color:purple;font-weight:bold',
      { from: currentLocale, to: next, newHref }
    );
    // fuerza recarga
    window.location.href = newHref;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<header class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80
               backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
  <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
    <!-- Logo / Home -->
    <a
      href={hrefWithLocale('/', currentLocale)}
      class="text-xl font-bold text-gray-900 dark:text-white"
    >
      Portfolio
    </a>

    <!-- Desktop nav -->
    <div class="hidden md:flex items-center space-x-8">
      {#each navItems as item}
        <a
          href={hrefWithLocale(item.href, currentLocale)}
          class="text-gray-700 dark:text-gray-300 hover:text-blue-600
                 dark:hover:text-blue-400 transition-colors"
          class:text-blue-600={basePath === item.href}
        >
          {item.label()}
        </a>
      {/each}
    </div>

    <!-- Controls: theme | language | menu toggle -->
    <div class="flex items-center space-x-4">
      <!-- theme toggle -->
      <button
        on:click={toggleTheme}
        aria-label="Toggle theme"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800
               hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {#if $theme === 'light'}
          <Moon class="w-5 h-5"/>
        {:else}
          <Sun class="w-5 h-5"/>
        {/if}
      </button>

      <!-- language toggle -->
      <button
        on:click={toggleLanguage}
        aria-label="Toggle language"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800
               hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center space-x-1"
      >
        <Globe class="w-5 h-5"/>
        <span class="text-sm font-medium">
          {currentLocale.toUpperCase()}
        </span>
      </button>

      <!-- mobile menu toggle -->
      <button
        on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
        aria-label="Toggle menu"
        class="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800
               hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {#if mobileMenuOpen}
          <X class="w-5 h-5"/>
        {:else}
          <Menu class="w-5 h-5"/>
        {/if}
      </button>
    </div>
  </nav>

  <!-- Mobile nav -->
  {#if mobileMenuOpen}
    <div class="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
      {#each navItems as item}
        <a
          href={hrefWithLocale(item.href, currentLocale)}
          on:click={closeMobileMenu}
          class="block py-2 text-gray-700 dark:text-gray-300
                 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          class:text-blue-600={basePath === item.href}
        >
          {item.label()}
        </a>
      {/each}
    </div>
  {/if}
</header>
