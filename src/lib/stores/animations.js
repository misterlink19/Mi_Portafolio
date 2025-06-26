import { writable } from 'svelte/store';

export const pageTransition = writable(false);
export const scrollElements = writable(new Set());

export function addScrollElement(element) {
	scrollElements.update((set) => {
		set.add(element);
		return set;
	});
}

export function removeScrollElement(element) {
	scrollElements.update((set) => {
		set.delete(element);
		return set;
	});
}
