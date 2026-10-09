export default defineNuxtConfig({
	modules: ['../src/module'],
	vite: {
		optimizeDeps: {
			include: [
				'@vueuse/core',
				'@formkit/tempo',
				'es-toolkit',
			],
		},
	},
	compatibilityDate: '2026-08-04',
})
