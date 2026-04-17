import {
	addComponentsDir,
	addImportsDir,
	addPlugin,
	createResolver,
	defineNuxtModule,
} from '@nuxt/kit'
import { defu } from 'defu'

import type { ToastManagerConfig } from './runtime/toast/toast-manager'

import { defaultOptions } from './defaults'


// Module options TypeScript interface definition
export interface ModuleOptions {
	/**
	 * Prefix for component name
	 * @default 'N'
	 * @example 'N' => <NButton />
	 */
	prefix?: string

	/**
	 * Auto import components
	 * @default true
	 */
	autoImport?: boolean

	/**
	 * Default theme
	 * @default 'light'
	 */
	theme?: 'light' | 'dark' | 'auto'

	/** Toast manager configuration */
	toast?: ToastManagerConfig
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: '@nuxtjs/nuance-ui',
		configKey: 'nui',
		compatibility: {
			nuxt: '^4.0.0',
		},
	},
	moduleDependencies: {
		'@nuxtjs/color-mode': {
			version: '>=4.0.0',
			overrides: {
				dataValue: 'mantine-color-scheme',
			},
		},
		'@nuxt/icon': {
			version: '>=2.1.0',
			defaults: {
				class: '',
			},
		},
	},
	defaults: defaultOptions,
	setup(options, nuxt) {
		const { resolve } = createResolver(import.meta.url)


		// ─── App Config ───

		nuxt.options.appConfig.nui = defu(
			nuxt.options.appConfig.nui || {},
			defaultOptions,
		)


		// ─── Types Templates ───

		const aliases = {
			composables: resolve('./runtime/composables'),
			components: resolve('./runtime/components'),
			utils: resolve('./runtime/utils'),
			types: resolve('./runtime/types'),
			modals: resolve('./runtime/modals'),
		}

		for (const key in aliases) {
			nuxt.options.alias[`@nui/${key}`] = aliases[key as keyof typeof aliases]
		}

		// ─── PostCSS config ───

		nuxt.options.postcss = nuxt.options.postcss || {}
		nuxt.options.postcss.plugins = nuxt.options.postcss.plugins || {}

		nuxt.options.postcss.plugins = defu(nuxt.options.postcss.plugins, {
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
		})


		// ─── Add components ───

		if (options.autoImport) {
			addComponentsDir({
				path: aliases.components,
				prefix: options.prefix,
				pathPrefix: false,
				extensions: ['.vue'],
				ignore: [
					'**/_*/**',
					'**/types/**',
					'**/*.module.css',
				],
			})

			addImportsDir(aliases.composables)
			addImportsDir(aliases.utils)
		}


		// ─── Add global styles ───

		nuxt.options.css.push(resolve('./runtime/styles/global.css'))


		// ─── Plugins ───

		addPlugin(resolve('./runtime/plugins/toast.client'))
	},
})
