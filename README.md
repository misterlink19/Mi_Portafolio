# 🌐 Mi Portafolio

Un portafolio personal estático moderno, construido con **SvelteKit** y desplegado eficientemente en **Azure Static Web Apps**. Este proyecto muestra mi trabajo y habilidades a través de una interfaz interactiva y fácil de usar.

## 🚀 Live Demo

Explora el portafolio desplegado:  
👉 [Visita el la aplicacion desplegada aquí]([https://github.com/misterlink19/Mi_Portafolio](https://mango-cliff-0c6c03b1e.2.azurestaticapps.net/))

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
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml             # Despliegue automático en Azure
├── .vscode/
│   └── settings.json                             # Configuración personalizada para VS Code
├── messages/                                     # Traducciones JSON para el formulario de contacto
│   ├── en.json
│   └── es.json
├── project.inlang/                               # Configuración para internacionalización con Paraglide
│   ├── .gitignore
│   ├── project_id
│   └── settings.json
├── src/
│   ├── app.css                                    # Estilos globales
│   ├── app.d.ts                                   # Tipado global para TypeScript
│   ├── app.html                                   # HTML base usado por SvelteKit
│   ├── hooks.ts                                   # Hooks cliente
│   ├── hooks.server.ts                            # Hooks del lado servidor
│   ├── lib/
│   │   ├── components/                            # Componentes UI reutilizables
│   │   │   ├── Footer.svelte
│   │   │   ├── Header.svelte
│   │   │   ├── ImageCarousel.svelte
│   │   │   ├── ScrollToTop.svelte
│   │   │   ├── SkillItem.svelte
│   │   │   └── Timeline.svelte
│   │   ├── data/
│   │   │   └── portfolio.js                       # Datos estructurados del portafolio
│   │   ├── paraglide/
│   │   │   └── messages.js                        # Traducciones dinámicas (i18n)
│   │   └── stores/
│   │       ├── animations.js                      # Control de animaciones/transiciones
│   │       └── theme.js                           # Estado para modo claro/oscuro
│   ├── routes/
│   │   ├── +layout.svelte                         # Layout global del sitio
│   │   ├── +layout.ts                             # Script asociado al layout
│   │   ├── +page.svelte                           # Página principal (home)
│   │   ├── about/
│   │   │   └── +page.svelte                       # Página "Sobre mí"
│   │   ├── contact/
│   │   │   └── +page.svelte                       # Página de contacto
│   │   ├── projects/
│   │   │   └── +page.svelte                       # Página con proyectos realizados
├── static/
│   ├── favicon.png                                # Ícono del sitio
│   ├── icons/                                     # Íconos SVG personalizados
│   ├── images/                                    # Imágenes generales del sitio
│   └── projects/                                  # Imágenes asociadas a cada proyecto
├── .gitignore                                     # Exclusión de archivos para Git
├── .npmrc                                         # Configuración de npm local
├── .prettierrc                                    # Reglas de formato de Prettier
├── .prettierignore                                # Archivos ignorados por Prettier
├── eslint.config.js                               # Reglas de linting
├── jsconfig.json                                  # Configuración JS/TS para VSCode
├── package-lock.json                              # Mapa de dependencias (npm)
├── package.json                                   # Scripts y dependencias del proyecto
├── README.md                                      # Documentación principal
├── svelte.config.js                               # Adaptador y configuración de SvelteKit
└── vite.config.js                                 # Configuración de bundling con Vite
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


- Cree un recurso estastico de Web en Azure 
- Modifique el workflow CI/CD que le creo Azure en que  `.github/workflows/`
- Copie la configuracion del workflow CI/CD en `.github/workflows/azure-static-web-apps.yml` menos el trabajo de deploy.
-  Y listo con cada push a `master` despliega automáticamente la app.

## 🌍 Internacionalización (i18n)

- Todas las cadenas en `src/lib/paraglide/messages.js`.
- Inlang gestiona las traducciones y runtime.
- El selector de idioma está en `src/routes/+layout.svelte`.

