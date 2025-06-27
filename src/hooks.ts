// src/hooks.ts
/**
 * Hooks universales para SvelteKit.
 *
 * Configura el hook `reroute` para manejar la internacionalización (i18n),
 * normalizando las URLs al eliminar el prefijo de idioma.
 */

// Tipo de hook `Reroute` de SvelteKit.
import type { Reroute } from '@sveltejs/kit';
// Función de Paraglide.js para eliminar el prefijo de idioma de una URL.
import { deLocalizeUrl } from '$lib/paraglide/runtime';

/**
 * @exports reroute
 * Hook `reroute` de SvelteKit.
 *
 * Se ejecuta antes del enrutamiento de SvelteKit para transformar la URL.
 * Elimina el prefijo de idioma de la URL (`/es/about` -> `/about`)
 * para que el enrutador interno trabaje con rutas canónicas.
 */
export const reroute: Reroute = (request) => {
    return deLocalizeUrl(request.url).pathname;
};