<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { locales, getLocale, localizeHref } from '$lib/paraglide/runtime';
    import * as m from '$lib/paraglide/messages';
    import { theme, toggleTheme } from '$lib/stores/theme';
    import { Moon, Sun, Globe, Menu, X } from '@lucide/svelte';

    let mobileMenuOpen = false;
    
    $: currentLocale = ($page.data.paraglide?.lang || getLocale());
    $: currentPath = $page.url.pathname;
    $: basePath = currentPath.startsWith(`/${currentLocale}`)
        ? currentPath.replace(`/${currentLocale}`, '') || '/'
        : currentPath || '/';

    $: console.log(
        '%c[Header]',
        'color:teal;font-weight:bold',
        { currentPath, currentLocale, basePath }
    );

    interface NavItem { href: string; label: () => string }
    const navItems: NavItem[] = [
        { href: '/',         label: m['nav.home']    },
        { href: '/about',    label: m['nav.about']   },
        { href: '/projects', label: m['nav.projects']},
        { href: '/contact',  label: m['nav.contact'] }
    ];

    function toggleLanguage() {
        const idx = locales.indexOf(currentLocale);
        const next = locales[(idx + 1) % locales.length];
        const newHref = localizeHref(basePath, { locale: next });

        console.log(
            '%c[Header.toggleLanguage]',
            'color:purple;font-weight:bold',
            'Intentando navegar a:', newHref,
            'Desde locale:', currentLocale,
            'Hacia locale:', next,
            'Base Path:', basePath
        );

        goto(newHref);
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }
</script>

<header class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80
               backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
        <a
          href={localizeHref('/', { locale: currentLocale })}
          class="text-xl font-bold text-gray-900 dark:text-white"
        >
          Portfolio
        </a>

        <div class="hidden md:flex items-center space-x-8">
            {#key currentLocale}
                {#each navItems as item}
                    <a
                      href={localizeHref(item.href, { locale: currentLocale })}
                      class="text-gray-700 dark:text-gray-300 hover:text-blue-600
                             dark:hover:text-blue-400 transition-colors"
                      class:text-blue-600={basePath === item.href}
                    >
                      {item.label()}
                    </a>
                {/each}
            {/key}
        </div>

        <div class="flex items-center space-x-4">
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

    {#if mobileMenuOpen}
        <div class="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
            {#key currentLocale}
                {#each navItems as item}
                    <a
                      href={localizeHref(item.href, { locale: currentLocale })}
                      on:click={closeMobileMenu}
                      class="block py-2 text-gray-700 dark:text-gray-300
                             hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      class:text-blue-600={basePath === item.href}
                    >
                      {item.label()}
                    </a>
                {/each}
            {/key}
        </div>
    {/if}
</header>