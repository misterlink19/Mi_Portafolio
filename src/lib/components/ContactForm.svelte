<script lang="ts">
  // --- Importaciones ---
  // Transiciones de Svelte para animaciones de UI.
  import { scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  // Mensajes internacionalizados para textos de la interfaz y validación.
  import * as m from '$lib/paraglide/messages';

  // Icono de envío para el botón del formulario.
  import { Send } from '@lucide/svelte';

  // --- Integración con SvelteKit Forms ---
  // `enhance`: Función para interceptar el envío del formulario y manejarlo con JavaScript (SPA-like).
  import { enhance } from '$app/forms';
  // `page` store: Acceso a los datos de la página y del formulario (errores, éxito) desde el servidor.
  import { page } from '$app/stores';

  // --- Variables de Estado Reactivas ($state) ---
  // `formData`: Contiene los valores actuales de los campos del formulario.
  // Se inicializa con datos del servidor (`$page.form?.formData`) para persistir entradas en caso de error.
  let formData = $state({
    name: $page.form?.formData?.name || '',
    email: $page.form?.formData?.email || '',
    message: $page.form?.formData?.message || ''
  });

  // `errors`: Objeto reactivo que contiene los mensajes de error de validación devueltos por el servidor.
  let errors = $derived($page.form?.errors || {});
  // `isSubmitting`: Bandera que indica si el formulario está en proceso de envío.
  let isSubmitting = $state(false);
  // `showSuccess`: Bandera que controla la visibilidad del mensaje de éxito.
  let showSuccess = $state($page.form?.success === true);

  // --- Clases de Tailwind Reutilizables ---
  // Optimizan la consistencia visual y reducen la repetición en el marcado.
  const inputClasses =
    'w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white';
  const inputBorderClasses = 'border-gray-300 dark:border-gray-600';
  const errorTextClasses = 'mt-1 text-sm text-red-600 dark:text-red-400';

  // --- Lógica de Validación del Formulario (Cliente) ---
  // Proporciona feedback instantáneo al usuario antes de enviar al servidor.
  // La validación en el servidor es la capa de seguridad principal.
  function validateClientForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = m['contact.nameRequired']();
    if (!formData.email.trim()) {
      newErrors.email = m['contact.emailRequired']();
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = m['contact.emailInvalid']();
    }
    if (!formData.message.trim()) newErrors.message = m['contact.messageRequired']();

    // Retorna `true` si todos los campos son válidos en el cliente.
    return Object.keys(newErrors).length === 0;
  }

  // --- Efecto Reactivo ($effect) ---
  // Observa si el formulario se envió con éxito y limpia los campos,
  // luego oculta el mensaje de éxito después de un tiempo.
  $effect(() => {
    if ($page.form?.success) {
      formData = { name: '', email: '', message: '' }; // Limpia los campos del formulario.
      showSuccess = true; // Muestra el mensaje de éxito.
      setTimeout(() => showSuccess = false, 5000); // Oculta el mensaje después de 5 segundos.
    }
  });
</script>

<div
  class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
>
  {#if showSuccess}
    <!-- Mensaje de éxito que aparece tras un envío exitoso. -->
    <div
      class="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200"
      transition:scale={{ duration: 400, easing: quintOut }}
    >
      <p class="font-medium">{m['contact.success']()}</p>
    </div>
  {/if}

  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
    {m['contact.title']()}
  </h2>

  <!-- Formulario de contacto.
       `method="POST"`: Envía los datos al servidor.
       `use:enhance`: Permite un envío sin recarga de página y control de estados.
       No se usa `action` ni `formaction` para la acción `default` de SvelteKit.
  -->
  <form
    method="POST"
    use:enhance={() => {
      // Se ejecuta ANTES de enviar el formulario.
      if (!validateClientForm()) {
        // Si la validación del cliente falla, interrumpe el envío.
        // Aquí se podría añadir lógica para resaltar campos o mostrar alertas.
        return async ({ update }) => { /* No-op para prevenir el envío. */ };
      }

      isSubmitting = true; // Activa el indicador de envío.
      showSuccess = false; // Oculta cualquier mensaje de éxito anterior.

      return async ({ update }) => {
        // Se ejecuta DESPUÉS de que la acción del servidor responde.
        isSubmitting = false; // Desactiva el indicador de envío.
        await update(); // Refresca los datos de la página y del formulario (`$page.form`).
      };
    }}
    class="space-y-6"
  >
    <!-- Campo Nombre -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {m['contact.name']()}
      </label>
      <input
        type="text"
        id="name"
        name="name"
        bind:value={formData.name}
        class="{inputClasses} {inputBorderClasses}"
        class:border-red-500={errors.name}
      />
      {#if errors.name}
        <p class="{errorTextClasses}">{errors.name}</p>
      {/if}
    </div>

    <!-- Campo Email -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {m['contact.email']()}
      </label>
      <input
        type="email"
        id="email"
        name="email"
        bind:value={formData.email}
        class="{inputClasses} {inputBorderClasses}"
        class:border-red-500={errors.email}
      />
      {#if errors.email}
        <p class="{errorTextClasses}">{errors.email}</p>
      {/if}
    </div>

    <!-- Campo Mensaje -->
    <div>
      <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {m['contact.message']()}
      </label>
      <textarea
        id="message"
        name="message"
        rows="5"
        bind:value={formData.message}
        class="{inputClasses} {inputBorderClasses}"
        class:border-red-500={errors.message}
      ></textarea>
      {#if errors.message}
        <p class="{errorTextClasses}">{errors.message}</p>
      {/if}
    </div>

    <!-- Botón de Envío -->
    <button
      type="submit"
      class="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      class:opacity-50={isSubmitting}
      disabled={isSubmitting}
    >
      {#if isSubmitting}
        <!-- Spinner SVG que indica que el formulario se está enviando. -->
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {m['contact.sending']()}
      {:else}
        <!-- Texto e icono del botón cuando el formulario no se está enviando. -->
        <Send class="w-5 h-5 mr-2" />
        {m['contact.send']()}
      {/if}
    </button>
    {#if errors.general}
      <!-- Muestra un mensaje de error general si el envío falla en el servidor. -->
      <p class="{errorTextClasses}">{errors.general}</p>
    {/if}
  </form>
</div>