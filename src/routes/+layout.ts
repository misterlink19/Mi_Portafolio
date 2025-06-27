// src/routes/+layout.ts
/**
 * Layout universal de SvelteKit.
 *
 * Este archivo define propiedades o lógica que se aplican a las rutas hijas.
 * Se ejecuta tanto en el servidor como en el cliente.
 */

/**
 * @exports prerender
 * Configura el prerenderizado de las rutas asociadas a este layout.
 *
 * `true` indica a SvelteKit que genere HTML estático para todas las páginas
 * cubiertas por este layout durante el proceso de construcción.
 * Esto es ideal para sitios estáticos, mejorando el rendimiento y el SEO,
 * y facilitando el despliegue en servicios como Azure Static Web Apps.
 */
export const prerender = true;
