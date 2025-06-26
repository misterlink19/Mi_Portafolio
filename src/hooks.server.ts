// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

const paraglideHandle: Handle = ({ event, resolve }) =>
    paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
        event.request = localizedRequest;
        // ¡IMPORTANTE! Asegúrate de que el locale esté disponible en `event.locals`
        // para que SvelteKit lo pase al `page.data` del layout.
        // Algunos setups de Paraglide lo hacen automáticamente, otros no.
        // Si no lo hace, esta es una forma de pasarlo explícitamente:
        (event.locals as any).paraglide = { lang: locale }; // Adapta esto si 'locals' ya tiene una interfaz

        return resolve(event, {
            transformPageChunk: ({ html }) => {
                // Esta línea ya usa `locale` que viene del middleware
                return html.replace('%lang%', locale);
            }
        });
    });

export const handle: Handle = paraglideHandle;