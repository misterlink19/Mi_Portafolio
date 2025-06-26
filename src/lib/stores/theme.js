// src/lib/stores/theme.js
import { browser } from "$app/environment"
import { writable } from "svelte/store"

const defaultTheme = "light"

// Solo accede a localStorage si estamos en el navegador (no en SSR)
const initialTheme = browser ? (localStorage.getItem("theme") ?? defaultTheme) : defaultTheme

// Crear store reactivo para el tema
export const theme = writable(initialTheme)

// Suscribirse a cambios del tema para:
// 1. Guardar en localStorage
// 2. Aplicar clase CSS al documento
theme.subscribe((value) => {
    if (browser) {
        // Persistir tema en localStorage
        localStorage.setItem("theme", value)

        // Aplicar/remover clase 'dark' del HTML
        if (value === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }
})

/**
 * Función helper para alternar entre temas
 */
export function toggleTheme() {
    theme.update((t) => (t === "light" ? "dark" : "light"))
}