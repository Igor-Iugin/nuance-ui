export default defineNuxtConfig({
	modules: ['../src/module'],
	devtools: { enabled: true },
	icon: {
		serverBundle: 'local',
		provider: 'iconify',
	},
})
