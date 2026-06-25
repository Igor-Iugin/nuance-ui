import type { NuanceGradient, NuanceIcons } from './types'
import type { ActiveVariantsMap } from './utils'


declare module '@nuxt/schema' {
	interface AppConfigInput {
		nui?: {
			/** Default gradient configuration */
			gradient?: NuanceGradient
			/** Icon registry overrides */
			icons?: Partial<NuanceIcons>
			/** Variant an ActionIcon switches to when `active`, keyed by its base variant */
			activeVariants?: Partial<ActiveVariantsMap>
		}
	}

	interface AppConfig {
		nui: {
			gradient: NuanceGradient
			icons: NuanceIcons
			activeVariants: ActiveVariantsMap
		}
	}
}

export {}
