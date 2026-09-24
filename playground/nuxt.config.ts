export default defineNuxtConfig({
	modules: ['../src/module', '@nuxt/image'],
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
