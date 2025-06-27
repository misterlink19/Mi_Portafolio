// src/lib/stores/animation.js

// Importa la función `writable` de Svelte para crear stores que pueden ser modificados.
import { writable } from 'svelte/store';

/**
 * @typedef {import('svelte/store').Writable<boolean>} WritableBoolean
 * @typedef {import('svelte/store').Writable<Set<HTMLElement>>} WritableSetOfElements
 */

/**
 * @type {WritableBoolean} pageTransition - Un store booleano que indica si una transición de página está activa.
 * Puede usarse para coordinar animaciones entre páginas o para deshabilitar interacciones
 * mientras una nueva página se carga con transiciones.
 */
export const pageTransition = writable(false);

/**
 * @type {WritableSetOfElements} scrollElements - Un store que contiene un Set de elementos HTML.
 * Este Set se utiliza para registrar y gestionar elementos del DOM que deben ser observados
 * para efectos de animación basados en el scroll (por ejemplo, con Intersection Observer).
 */
export const scrollElements = writable(new Set());

/**
 * Añade un elemento HTML al Set de `scrollElements`.
 * Esto permite que el elemento sea monitoreado para animaciones o efectos de scroll.
 * @param {HTMLElement} element - El elemento DOM (HTML) a añadir al conjunto.
 */
export function addScrollElement(element) {
	scrollElements.update((set) => {
		set.add(element); // Agrega el elemento al Set.
		return set; // Devuelve el Set actualizado.
	});
}

/**
 * Elimina un elemento HTML del Set de `scrollElements`.
 * Se usa para limpiar las referencias a elementos que ya no están en el DOM o que
 * ya no necesitan ser observados para animaciones (ej. cuando un componente se desmonta).
 * @param {HTMLElement} element - El elemento DOM (HTML) a eliminar del conjunto.
 */
export function removeScrollElement(element) {
	scrollElements.update((set) => {
		set.delete(element); // Elimina el elemento del Set.
		return set; // Devuelve el Set actualizado.
	});
}
