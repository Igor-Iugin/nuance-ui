export default defineNuxtConfig({
	modules: ['../src/module'],
	vite: {
		optimizeDeps: {
			include: [
				'@vue/devtools-core',
				'@vue/devtools-kit',
				'@vueuse/core',
				'@formkit/tempo',
				'es-toolkit',
			],
		},
	},
})
