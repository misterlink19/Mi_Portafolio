// src/lib/stores/theme.js

// Importa `browser` para verificar si el código se ejecuta en el navegador (no en el servidor).
import { browser } from '$app/environment';
// Importa `writable` de Svelte para crear un store reactivo.
import { writable } from 'svelte/store';

/**
 * @typedef {'light' | 'dark'} Theme
 * @typedef {import('svelte/store').Writable<Theme>} WritableTheme
 */

/**
 * @const {Theme} defaultTheme - El tema predeterminado si no se encuentra ninguno guardado.
 */
const defaultTheme = 'light';

/**
 * @type {Theme} initialTheme - Determina el tema inicial al cargar la aplicación.
 * Si se está ejecutando en el navegador, intenta obtener el tema de `localStorage`.
 * Si no hay tema guardado o no se está en el navegador (SSR), usa `defaultTheme`.
 */
const initialTheme = browser ? (localStorage.getItem('theme') ?? defaultTheme) : defaultTheme;

/**
 * @type {WritableTheme} theme - Store Svelte reactivo para gestionar el tema actual de la UI.
 * Los componentes pueden suscribirse a este store para reaccionar a los cambios de tema.
 */
export const theme = writable(initialTheme);

/**
 * Suscripción al store `theme`.
 * Se ejecuta cada vez que el valor del tema cambia.
 * 1. Persiste el tema seleccionado en `localStorage` del navegador.
 * 2. Añade o remueve la clase 'dark' del elemento `<html>`, lo cual es utilizado
 * por Tailwind CSS para aplicar estilos específicos del modo oscuro.
 */
theme.subscribe((value) => {
    if (browser) { // Asegura que solo se ejecute en el entorno del navegador.
        localStorage.setItem('theme', value); // Guarda la preferencia del usuario.

        if (value === 'dark') {
            document.documentElement.classList.add('dark'); // Aplica estilos oscuros.
        } else {
            document.documentElement.classList.remove('dark'); // Aplica estilos claros.
        }
    }
});

/**
 * Función `toggleTheme`.
 *
 * Alterna el tema actual entre 'light' y 'dark'.
 * Utiliza el método `update` del store `theme` para cambiar su valor de forma segura,
 * lo que automáticamente activa la suscripción y actualiza la UI.
 */
export function toggleTheme() {
    theme.update((t) => (t === 'light' ? 'dark' : 'light'));
}