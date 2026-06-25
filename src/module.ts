import {
	addComponentsDir,
	addImportsDir,
	addTemplate,
	addTypeTemplate,
	createResolver,
	defineNuxtModule,
} from '@nuxt/kit'
import { defu } from 'defu'

import type { PrimaryColor } from './build/generate-primary-css'
import type { NuanceGradient, NuanceIcons } from './runtime/types'
import type { ActiveVariantsMap } from './runtime/utils'

import { generatePrimaryCss } from './build/generate-primary-css'
import { DEFAULT_ACTIVE_VARIANTS, DEFAULT_GRADIENT, DEFAULT_ICONS } from './runtime/utils'

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

	/**
	 * Primary color: a theme palette name or an array of 10 shade values (0..9)
	 * @default 'blue'
	 */
	primaryColor?: PrimaryColor

	/** Default gradient configuration */
	gradient?: NuanceGradient

	/** Icon registry overrides */
	icons?: Partial<NuanceIcons>

	/** Variant an ActionIcon switches to when `active`, keyed by its base variant */
	activeVariants?: Partial<ActiveVariantsMap>
}

const defaultConfig = {
	autoImport: true,
	theme: 'light',
	prefix: 'N',
	primaryColor: 'blue',
	gradient: DEFAULT_GRADIENT,
	icons: DEFAULT_ICONS,
	activeVariants: DEFAULT_ACTIVE_VARIANTS,
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
				class: '',
			},
		},
	},
	// Default configuration options of the Nuxt module
	defaults: defaultConfig,
	setup(options, nuxt) {
		const { resolve } = createResolver(import.meta.url)


		// ─── Types Templates ───

		const aliases = {
			composables: resolve('./runtime/composables'),
			components: resolve('./runtime/components'),
			form: resolve('./runtime/form'),
			utils: resolve('./runtime/utils'),
			types: resolve('./runtime/types'),
			modals: resolve('./runtime/modals'),
		}

		for (const key in aliases) {
			nuxt.options.alias[`@nui/${key}`] = aliases[key as keyof typeof aliases]
		}

		// ─── App config ───

		nuxt.options.appConfig.nui = defu(nuxt.options.appConfig.nui, {
			gradient: options.gradient,
			icons: options.icons,
			activeVariants: options.activeVariants,
		})

		addTypeTemplate({
			filename: 'types/nui-app-config.d.ts',
			src: resolve('./runtime/app-config.d.ts'),
		})

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

			addComponentsDir({
				path: aliases.form,
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

		// ─── Primary color ───

		const primaryCss = generatePrimaryCss(options.primaryColor ?? 'blue')
		const { dst } = addTemplate({
			filename: 'nui-primary-color.css',
			getContents: () => primaryCss,
			write: true,
		})

		nuxt.options.css.push(dst)
	},
})
