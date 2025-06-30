# 🌐 Mi Portafolio

Un portafolio personal estático moderno, construido con **SvelteKit** y desplegado eficientemente en **Azure Static Web Apps**. Este proyecto muestra mi trabajo y habilidades a través de una interfaz interactiva y fácil de usar.

## 🚀 Live Demo

Explora el portafolio desplegado:  
👉 [Visita el Live Demo aquí](https://github.com/misterlink19/Mi_Portafolio)

## ✨ Características Destacadas

- **Prerenderizado Completo (SSG):** Optimizado para rendimiento y SEO con `@sveltejs/adapter-static`.
- **Enrutamiento Flexible:** Navegación intuitiva con enrutamiento basado en archivos y layouts universales de SvelteKit.
- **Tema Personalizable:** Alterna entre tema claro y oscuro con una transición suave.
- **Formulario de Contacto:** Envío de mensajes seguro y validado a través de Web3Forms.
- **Animaciones Dinámicas:** Transiciones de entrada usando `svelte/transition`.
- **Internacionalización (i18n):** Soporte multilingüe usando Paraglide.js e Inlang.
- **CI/CD Automatizado:** Despliegue continuo desde GitHub a Azure mediante GitHub Actions.

## 🛠️ Tecnologías Utilizadas

- **Framework:** SvelteKit  
- **Estilos:** Tailwind CSS  
- **Iconografía:** Lucide Svelte  
- **Formularios:** Web3Forms  
- **Internacionalización:** Paraglide.js + Inlang  
- **CI/CD & Hosting:** GitHub Actions + Azure Static Web Apps  
- **Linting & Formato:** ESLint, Prettier

## 📂 Estructura del Proyecto

```plaintext
Mi_Portafolio/
├── .github/            # Workflows CI/CD
├── .vscode/            # Configuración VS Code
├── src/                # Código fuente
│   ├── lib/
│   │   ├── data/       # Datos estáticos
│   │   └── paraglide/  # Archivos i18n
│   ├── routes/         # Rutas y páginas
│   └── app.html        # HTML principal
├── static/             # Archivos públicos
├── project.inlang      # Config i18n (Inlang)
├── svelte.config.js    # Config SvelteKit
├── tailwind.config.cjs # Config Tailwind CSS
├── package.json        # Scripts y metadatos
└── README.md           # Este archivo
```

## ⚙️ Instalación y Desarrollo Local

```bash
git clone https://github.com/misterlink19/Mi_Portafolio.git
cd Mi_Portafolio
npm install
npm run dev -- --open
```

- Dev server en: `http://localhost:5173`  
- Para producción:

```bash
npm run build
npm run preview
```

## ✉️ Configuración del Formulario de Contacto

1. Crea una cuenta en [Web3Forms](https://web3forms.com) y copia tu `Access Key`.
2. Abre `src/routes/contacto/+page.svelte` y reemplaza:

```javascript
body: JSON.stringify({
  access_key: 'TU_ACCESS_KEY', // <-- ¡Reemplaza esto!
  name: formData.name,
  email: formData.email,
  message: formData.message
})
```

3. Guarda y prueba el formulario.

## 🚀 Despliegue en Azure Static Web Apps

- Usa `@sveltejs/adapter-static` en `svelte.config.js`.
- Asegúrate de tener `export const prerender = true` en tus rutas.
- Configura tu workflow CI/CD en `.github/workflows/azure-static-web-apps.yml`.
- Agrega el secreto `AZURE_STATIC_WEB_APPS_API_TOKEN...` en GitHub.
- Cada push a `master` despliega automáticamente la app.

## 🌍 Internacionalización (i18n)

- Todas las cadenas en `src/lib/paraglide/messages.js`.
- Inlang gestiona las traducciones y runtime.
- El selector de idioma está en `src/routes/+layout.svelte`.

