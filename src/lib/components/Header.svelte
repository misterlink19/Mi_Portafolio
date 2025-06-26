<!-- src/lib/components/Header.svelte -->
<script>
    /**
     * Header/Navbar usando Paraglide + store de idioma personalizado
     */
    import { page } from '$app/stores';
    import { currentLanguage } from '$lib/stores/language'; // Tu store de idioma
    import { theme, toggleTheme } from '$lib/stores/theme'; // Tu store de tema
    import * as m from '$lib/paraglide/messages'; // Mensajes de Paraglide

    // Lucide Icons (asegúrate de haber instalado @lucide/svelte)
    import { Moon, Sun, Globe, Menu, X } from '@lucide/svelte';

    let mobileMenuOpen = $state(false); // Svelte 5 syntax

    // Configura los elementos de navegación (ya usa m['nav.home'], etc.)
    const navItems = [
        { href: '/', label: m['nav.home'] },
        { href: '/about', label: m['nav.about'] },
        { href: '/projects', label: m['nav.projects'] },
        { href: '/contact', label: m['nav.contact'] }
    ];

    // Función para cambiar idioma (ahora usa la store `currentLanguage`)
    function toggleLanguage() {
        const newLang = $currentLanguage === 'es' ? 'en' : 'es';
        currentLanguage.set(newLang); // Esto actualizará la store y Paraglide
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }
</script>

<header
    class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50"
>
    <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <!-- Logo -->
            <a href="/" class="text-xl font-bold text-gray-900 dark:text-white">Portfolio</a>

            <!-- Navegación Desktop -->
            <div class="hidden md:flex items-center space-x-8">
                {#each navItems as item}
                    <a
                        href={item.href}
                        class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        class:text-blue-600={$page.url.pathname === item.href}
                        class:dark:text-blue-400={$page.url.pathname === item.href}
                    >
                        {item.label()}
                    </a>
                {/each}
            </div>

            <!-- Controles de tema e idioma -->
            <div class="flex items-center space-x-4">
                <!-- Botón Tema claro/oscuro -->
                <button
                    onclick={toggleTheme}
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle theme"
                >
                    {#if $theme === 'light'}
                        <Moon class="w-5 h-5" />
                    {:else}
                        <Sun class="w-5 h-5" />
                    {/if}
                </button>

                <!-- Botón para cambiar idioma -->
                <button
                    onclick={toggleLanguage}
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
                    aria-label="Toggle language"
                >
                    <Globe class="w-5 h-5" />
                    <span class="text-sm font-medium">{$currentLanguage.toUpperCase()}</span>
                </button>

                <!-- Botón menú móvil -->
                <button
                    onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
                    class="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle menu"
                >
                    {#if mobileMenuOpen}
                        <X class="w-5 h-5" />
                    {:else}
                        <Menu class="w-5 h-5" />
                    {/if}
                </button>
            </div>
        </div>

        <!-- Menú Móvil -->
        {#if mobileMenuOpen}
            <div class="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
                {#each navItems as item}
                    <a
                        href={item.href}
                        onclick={closeMobileMenu}
                        class="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        class:text-blue-600={$page.url.pathname === item.href}
                        class:dark:text-blue-400={$page.url.pathname === item.href}
                    >
                        {item.label()}
                    </a>
                {/each}
            </div>
        {/if}
    </nav>
</header>