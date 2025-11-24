import { addComponentsDir, addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'
import defu from 'defu'

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
}

const defaultConfig = {
	autoImport: true,
	theme: 'light',
	prefix: 'N',
} satisfies ModuleOptions

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
	},
	// Default configuration options of the Nuxt module
	defaults: defaultConfig,
	setup(options, nuxt) {
		const { resolve } = createResolver(import.meta.url)

		nuxt.options.appConfig.nui = defu(nuxt.options.appConfig.ui || {}, defaultConfig)

		// Регистрируем компоненты с префиксом
		if (options.autoImport) {
			addComponentsDir({
				path: resolve('./runtime/components'),
				prefix: options.prefix,
				pathPrefix: false,
				ignore: ['color-mode/**'],
			})

			addImportsDir(resolve('./runtime/composables'))
		}

		// Add global styles
		nuxt.options.css.push(resolve('./runtime/assets/css/main.css'))
	},
})
