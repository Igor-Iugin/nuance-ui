import type { NuanceGradient, NuanceIcons } from './types'


declare module '@nuxt/schema' {
	interface AppConfigInput {
		nui?: {
			/** Default gradient configuration */
			gradient?: NuanceGradient
			/** Icon registry overrides */
			icons?: Partial<NuanceIcons>
		}
	}

	interface AppConfig {
		nui: {
			gradient: NuanceGradient
			icons: NuanceIcons
		}
	}
}

export {}
