// src/hooks.server.ts
/**
 * Hooks del Servidor para SvelteKit.
 *
 * Este archivo central maneja las solicitudes a nivel de servidor,
 * integrando funcionalidades globales como la internacionalización (i18n)
 * a través de Paraglide.js antes de que la solicitud sea procesada por SvelteKit.
 */

// Tipado para el hook `handle` de SvelteKit.
import type { Handle } from '@sveltejs/kit';
// Middleware de Paraglide.js para la detección y gestión del idioma en el servidor.
import { paraglideMiddleware } from '$lib/paraglide/server';

/**
 * @const {Handle} paraglideHandle - Hook de SvelteKit para la internacionalización.
 * Envuelve el `paraglideMiddleware` para:
 * 1. Detectar el idioma de la solicitud.
 * 2. Adaptar la URL de la solicitud si es necesario (ej. añadir prefijo de idioma).
 * 3. Hacer el idioma detectado disponible en `event.locals`.
 * 4. Inyectar el idioma en el atributo `lang` de la etiqueta `<html>` del HTML final.
 */
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		// Actualiza el objeto `request` con la versión localizada por Paraglide.js.
		event.request = localizedRequest;

		// Almacena el idioma detectado en `event.locals` para que sea accesible
		// en otras partes del servidor (e.g., funciones `load`).
		(event.locals as any).paraglide = { lang: locale };

		// Resuelve la solicitud con SvelteKit, aplicando transformaciones adicionales.
		return resolve(event, {
			// `transformPageChunk` modifica el HTML generado.
			// Reemplaza el placeholder `%lang%` con el idioma detectado,
			// típicamente usado en `<html lang="%lang%">` en `src/app.html`.
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

/**
 * Exporta el hook `paraglideHandle` como el `handle` principal de SvelteKit.
 */
export const handle: Handle = paraglideHandle;
