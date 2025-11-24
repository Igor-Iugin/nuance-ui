export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxt/icon',
		'@nuxtjs/color-mode',
	],
	colorMode: {
		dataValue: 'mantine-color-scheme',
	},
	icon: {
		mode: 'svg',
		class: '',
		clientBundle: {
			scan: {
				globInclude: ['src/**/*.vue', 'src/**/*.ts'],
				globExclude: [
					'node_modules',
					'.idea',
					'.output',
					'.data',
					'.nuxt',
					'.nitro',
					'.cache',
					'dist',
					'server',
				],
			},
			includeCustomCollections: true,
			sizeLimitKb: 256,
		},
	},
	eslint: {
		config: { standalone: false },
	},
	postcss: {
		plugins: {
			'postcss-import': {},
			'postcss-preset-mantine': {},
			'postcss-simple-vars': {
				variables: {
					'breakpoint-xs': '36em',
					'breakpoint-sm': '48em',
					'breakpoint-md': '62em',
					'breakpoint-lg': '75em',
					'breakpoint-xl': '88em',
				},
			},
			'autoprefixer': {},
		},
	},
})
