import { fileURLToPath } from 'node:url'


export default defineNuxtConfig({
	alias: {
		'@nui/helpers': fileURLToPath(new URL('src/runtime/helpers', import.meta.url)),
		'@nui/composals': fileURLToPath(new URL('src/runtime/composals', import.meta.url)),
		'@nui/types': fileURLToPath(new URL('src/runtime/types', import.meta.url)),
		'@nui/utils': fileURLToPath(new URL('src/runtime/utils', import.meta.url)),
	},
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
	typescript: {
		typeCheck: true,
		strict: true,
		tsConfig: {
			compilerOptions: {
				moduleResolution: 'bundler',
			},
		},
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
	vite: {
		css: {
			modules: {
				localsConvention: 'camelCase',
			},
		},
	},
})
