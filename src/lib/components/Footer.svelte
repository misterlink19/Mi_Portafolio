<script>
	// Importa todas las funciones de traducción generadas por Paraglide
	import * as m from '$lib/paraglide/messages';

	// Lista de enlaces de navegación con las funciones de traducción asociadas
	const navItems = [
		{ href: '/', label: m['nav.home'] },
		{ href: '/about', label: m['nav.about'] },
		{ href: '/projects', label: m['nav.projects'] },
		{ href: '/contact', label: m['nav.contact'] }
	];
</script>

<footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
	<div class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div>
				<h3 class="font-semibold text-gray-900 dark:text-white mb-4">{m['nav.home']()}</h3>
				<div class="space-y-2">
					{#each navItems as item}
						<a
							href={item.href}
							class="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
						>
							{item.label()}
						</a>
					{/each}
				</div>
			</div>

			<div>
				<h3 class="font-semibold text-gray-900 dark:text-white mb-4">{m['contact.title']()}</h3>
				<div class="space-y-2 text-gray-600 dark:text-gray-400">
					<p>tu@email.com</p>
					<p>Tu Ciudad, País</p>
				</div>
			</div>

			<div>
				<h3 class="font-semibold text-gray-900 dark:text-white mb-4">Tecnología</h3>
				<p class="text-gray-600 dark:text-gray-400">{m['footer.builtWith']()}</p>
			</div>
		</div>

		<div
			class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400"
		>
			<p>{m['footer.copyright']()}</p>
		</div>
	</div>
</footer>
