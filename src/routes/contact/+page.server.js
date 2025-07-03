// src/routes/contact/+page.server.js
import { fail } from '@sveltejs/kit';
import * as m from '$lib/paraglide/messages';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    const errors = {};

    // --- Validación en el Servidor ---
    // Es CRÍTICO validar tanto en el cliente como en el servidor.
    // La validación del cliente mejora UX, la del servidor es por seguridad.
    if (!name || name.trim() === '') {
      errors.name = m['contact.nameRequired']();
    }
    if (!email || email.trim() === '') {
      errors.email = m['contact.emailRequired']();
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = m['contact.emailInvalid']();
    }
    if (!message || message.trim() === '') {
      errors.message = m['contact.messageRequired']();
    }

    if (Object.keys(errors).length > 0) {
      // Si hay errores, usa `fail` para devolverlos al cliente.
      return fail(400, { success: false, errors, formData: { name, email, message } });
    }

    // --- Envío a Web3Forms ---
    try {
      const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'a13184c3-850f-48aa-911e-2890e181b423',
          name,
          email,
          message
        })
      });

      if (!web3formsResponse.ok) {
        const errorData = await web3formsResponse.json();
        console.error('Web3Forms API error:', errorData);
        // Devuelve un error genérico si la API externa falla.
        return fail(500, { success: false, errors: { general: m['contact.errorMessage']?.() ?? 'Error al enviar el mensaje.' }, formData: { name, email, message } });
      }

      // Si todo fue bien, devuelve un mensaje de éxito.
      return { success: true };
    } catch (error) {
      console.error('Server form submission error:', error);
      // Devuelve un error de servidor.
      return fail(500, { success: false, errors: { general: m['contact.errorMessage']?.() ?? 'Algo salió mal. Por favor, intenta de nuevo más tarde.' }, formData: { name, email, message } });
    }
  }
};