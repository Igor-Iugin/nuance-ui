import { defineBuildConfig } from 'unbuild'


export default defineBuildConfig({
	entries: [
		'src/module',
	],
	externals: [
		'#app',
		'#build',
		'#imports',
		'nuxt',
		'@nuxt/kit',
		'@nuxt/schema',
		'@nuxtjs/color-mode',
		'vue',
	],
	declaration: true,
	rollup: {
		emitCJS: false,
	},
})
