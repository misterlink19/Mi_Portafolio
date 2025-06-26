<!-- src/lib/components/ScrollToTop.svelte -->
<script>
    /**
     * Botón flotante para volver al inicio de la página
     * - Aparece al hacer scroll hacia abajo
     * - Soporta SSR-safe con `browser`
     * - Internacionalizado usando Paraglide
     * - Incluye animación de entrada para mejorar UX
     */

    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { ChevronUp } from '@lucide/svelte';
    import * as m from '$lib/paraglide/messages'; // Mensajes traducidos

    let showButton = false; // Estado local para mostrar u ocultar el botón

    onMount(() => {
        if (!browser) return; // Prevenir errores en SSR

        /**
         * Detecta si el scroll ha superado cierto umbral
         * y actualiza el estado para mostrar el botón
         */
        const handleScroll = () => {
            showButton = window.scrollY > 300;
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Ejecuta una vez por si ya cargó abajo

        // Limpia el listener al desmontar
        return () => window.removeEventListener('scroll', handleScroll);
    });

    /**
     * Realiza scroll suave hasta el tope de la página
     */
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
</script>

{#if showButton}
    <button
        on:click={scrollToTop}
        title={m["common.scrollToTop"]()}        
        aria-label={m["common.scrollToTop"]()}   
        class="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 z-40"
        transition:fly={{ y: 20, duration: 300 }}
    >
        <ChevronUp class="w-6 h-6" />
    </button>
{/if}
