<script lang="ts">
  // --- Importaciones ---
  // Embla Carousel para la funcionalidad del carrusel.
  import emblaCarouselSvelte from 'embla-carousel-svelte';
  // Plugin Autoplay para el avance automático de los slides.
  import Autoplay from 'embla-carousel-autoplay';
  // Tipo para la instancia del API de Embla (para TypeScript).
  import type { EmblaCarouselType } from 'embla-carousel';
  // Icono para mostrar cuando no hay imágenes.
  import { ImageOff } from '@lucide/svelte';

  // --- Propiedades del Componente (Props) ---
  // `images`: Array de URLs de las imágenes.
  // `projectId`: ID del proyecto (para alt text de imágenes).
  const { images, projectId } = $props<{ images: string[]; projectId: string }>();

  // --- Estado del Componente ---
  // Instancia del API de Embla Carousel para control programático.
  let emblaApi: EmblaCarouselType | undefined;
  // Índice del slide actualmente activo, usado para los puntos de navegación.
  let selectedIndex = $state(0);

  // --- Opciones y Plugins de Embla Carousel ---
  // Opciones principales del carrusel: `loop: true` permite que el carrusel sea infinito.
  const options = { loop: true };

  // Configuración del plugin Autoplay.
  const plugins = [
    Autoplay({
      delay: 3000,          // Avance automático cada 3 segundos.
      stopOnInteraction: false, // Continúa el auto-avance si el usuario interactúa.
      stopOnMouseEnter: true, // Pausa el auto-avance al pasar el ratón por encima.
      stopOnFocusIn: true,    // Pausa el auto-avance si el carrusel tiene foco.
    }),
  ];

  // --- Manejadores de Eventos ---
  // Se ejecuta cuando Embla Carousel se inicializa, obteniendo la instancia del API.
  function onInit(event: CustomEvent<EmblaCarouselType>) {
    emblaApi = event.detail;
    // Actualiza el índice del slide activo cada vez que cambia.
    emblaApi.on('select', () => {
      selectedIndex = emblaApi!.selectedScrollSnap();
    });
    // Establece el índice inicial al cargar.
    selectedIndex = emblaApi.selectedScrollSnap();
  }

  // Navega al slide siguiente usando el API de Embla.
  function showNextImage() {
    emblaApi?.scrollNext();
  }

  // Navega al slide anterior usando el API de Embla.
  function showPrevImage() {
    emblaApi?.scrollPrev();
  }

  // Navega a un slide específico por su índice.
  function goToImage(index: number) {
    emblaApi?.scrollTo(index);
  }
</script>

<div class="relative w-full max-w-xl mx-auto">
  {#if images && images.length > 0}
    <div class="embla" use:emblaCarouselSvelte="{{ options, plugins }}" onemblaInit={onInit}>
      <div class="embla__container">
        {#each images as imageSrc, i}
          <div class="embla__slide">
            <div
              class="overflow-hidden rounded-lg shadow-md aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-700"
            >
              <img
                src={imageSrc}
                alt={`Imagen ${i + 1} del proyecto ${projectId}`}
                class="w-full h-full object-contain block"
                loading="eager"
                style="will-change: transform;"
              />
            </div>
          </div>
        {/each}
      </div>
    </div>

    {#if images.length > 1}
      <button
        onclick={showPrevImage}
        class="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition z-10"
        aria-label="Imagen anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
      </button>

      <button
        onclick={showNextImage}
        class="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition z-10"
        aria-label="Imagen siguiente"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
      </button>

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {#each images as _, i}
          <button
            onclick={() => goToImage(i)}
            class="w-3 h-3 rounded-full {i === selectedIndex ? 'bg-white' : 'bg-gray-400'} hover:bg-white transition-colors"
            aria-label={`Ir a la imagen ${i + 1}`}
          ></button>
        {/each}
      </div>
    {/if}

  {:else}
    <div
      class="w-full h-48 bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center rounded-lg text-gray-500 dark:text-gray-400"
    >
      <ImageOff class="w-16 h-16 mb-2" />
      <p class="text-center">No hay imagen disponible.</p>
    </div>
  {/if}
</div>

<style>
  /* --- Estilos de Embla Carousel (requeridos) --- */
  .embla {
    overflow: hidden; /* Oculta los slides que están fuera de vista. */
  }
  .embla__container {
    display: flex; /* Muestra los slides en línea para el desplazamiento. */
  }
  .embla__slide {
    flex: 0 0 100%; /* Cada slide ocupa el 100% del ancho del contenedor y no se redimensiona. */
    min-width: 0; /* Asegura un comportamiento de encogimiento correcto en Flexbox. */
  }
</style>