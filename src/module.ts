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
		'@nuxt/icon': {
			version: '>=2.1.0',
			defaults: {
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
		},
	},
	// Default configuration options of the Nuxt module
	defaults: defaultConfig,
	setup(options, nuxt) {
		const { resolve } = createResolver(import.meta.url)

		nuxt.options.alias['#nuance-ui'] = resolve('./runtime')
		nuxt.options.appConfig.nui = defu(nuxt.options.appConfig.nui || {}, defaultConfig)

		// Регистрируем компоненты с префиксом
		if (options.autoImport) {
			addComponentsDir({
				path: resolve('./runtime/components'),
				prefix: options.prefix,
				pathPrefix: false,
				extensions: ['.vue'],
				ignore: [
					'**/lib/**',
					'**/lib.ts',
					'**/_*/**',
					'**/types/**',
					'**/index.ts',
					'**/*.module.css',
				],
			})

			addImportsDir(resolve('./runtime/composals'))
			addImportsDir(resolve('./runtime/helpers'))
		}

		// Add global styles
		nuxt.options.css.push(resolve('./runtime/styles/global.css'))
	},
})
