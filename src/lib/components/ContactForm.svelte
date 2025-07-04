<script lang="ts">
  // --- Importaciones ---
  // Transiciones de Svelte para animaciones de UI.
  import { scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  // Mensajes internacionalizados para textos de la interfaz y validación.
  import * as m from '$lib/paraglide/messages';

  // Icono de envío para el botón del formulario.
  import { Send } from '@lucide/svelte';

  // --- Variables de Estado Reactivas ($state) ---
  // `formData`: Contiene los valores actuales de los campos del formulario.
  let formData = $state({
    name: '',
    email: '',
    message: ''
  });

  // `errors`: Objeto reactivo para almacenar mensajes de error de validación por campo.
  let errors: Record<string, string> = $state({});
  // `isSubmitting`: Bandera que indica si el formulario está en proceso de envío.
  let isSubmitting = $state(false);
  // `showSuccess`: Bandera que controla la visibilidad del mensaje de éxito.
  let showSuccess = $state(false);
  // `generalError`: Almacena un mensaje de error general del envío (ej. error de red).
  let generalError = $state('');

  // --- Clases de Tailwind Reutilizables ---
  // Optimizan la consistencia visual y reducen la repetición en el marcado.
  const inputClasses =
    'w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white';
  const inputBorderClasses = 'border-gray-300 dark:border-gray-600';
  const errorTextClasses = 'mt-1 text-sm text-red-600 dark:text-red-400';

  // --- Lógica de Validación del Formulario (Cliente) ---
  // Valida los campos del formulario y actualiza el objeto `errors` localmente.
  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = m['contact.nameRequired']();
    if (!formData.email.trim()) {
      newErrors.email = m['contact.emailRequired']();
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = m['contact.emailInvalid']();
    }
    if (!formData.message.trim()) newErrors.message = m['contact.messageRequired']();

    errors = newErrors; // Asigna los errores validados al estado reactivo.
    return Object.keys(newErrors).length === 0; // Retorna `true` si no hay errores.
  }

  // --- Manejador de Envío del Formulario (Cliente-Side) ---
  // Procesa el envío del formulario, realiza la validación y la llamada a la API externa.
  async function handleSubmit(event: Event) { // Añadir 'event: Event' como parámetro
    event.preventDefault(); // Previene el comportamiento predeterminado del formulario.

    // Limpia los estados de mensajes previos antes de un nuevo intento.
    showSuccess = false;
    errors = {};
    generalError = '';

    // Valida el formulario en el cliente; detiene el envío si la validación falla.
    if (!validateForm()) {
      return;
    }

    isSubmitting = true; // Activa el indicador de envío.

    try {
      // Envía los datos del formulario a Web3Forms directamente desde el navegador.
      const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // ADVERTENCIA: La access_key estará visible en el código fuente del cliente.
          // Web3Forms está diseñado para manejar esto, pero es una consideración de seguridad.
          access_key: 'a13184c3-850f-48aa-911e-2890e181b423', // TU CLAVE REAL AQUÍ
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      // Procesa la respuesta de la API de Web3Forms.
      if (web3formsResponse.ok) {
        showSuccess = true; // Muestra el mensaje de éxito.
        formData = { name: '', email: '', message: '' }; // Limpia los campos del formulario.
        // Oculta el mensaje de éxito automáticamente después de 5 segundos.
        setTimeout(() => showSuccess = false, 5000);
      } else {
        // En caso de error de la API, intenta obtener un mensaje específico.
        const errorData = await web3formsResponse.json();
        console.error('Web3Forms API error:', errorData);
        generalError = errorData.message || (m['contact.errorMessage']?.() ?? 'Error al enviar el mensaje.');
      }
    } catch (error) {
      // Maneja errores de red o excepciones inesperadas durante el envío.
      console.error('Error en el envío del formulario cliente-side:', error);
      generalError = m['contact.errorMessage']?.() ?? 'Algo salió mal. Por favor, intenta de nuevo más tarde.';
    } finally {
      isSubmitting = false; // Siempre desactiva el indicador de envío.
    }
  }
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

  <!-- Formulario de contacto: Envío completamente manejado en el cliente.
       `onsubmit`: Atributo de evento nativo para manejar el envío del formulario.
       `event.preventDefault()` se llama dentro de `handleSubmit` para evitar la recarga de la página.
  -->
  <form onsubmit={handleSubmit} class="space-y-6">
    <!-- Campo Nombre: Input para el nombre del remitente. -->
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

    <!-- Campo Email: Input para la dirección de correo electrónico del remitente. -->
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

    <!-- Campo Mensaje: Área de texto para el mensaje del remitente. -->
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

    <!-- Botón de Envío: Activa el proceso de envío del formulario. -->
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
    {#if generalError}
      <!-- Muestra un mensaje de error general si el envío falla (ej. problemas de red). -->
      <p class="{errorTextClasses}">{generalError}</p>
    {/if}
  </form>
</div>
