/** Variant an ActionIcon switches to when `active`, keyed by its base variant. */
export const DEFAULT_ACTIVE_VARIANTS = {
	'default': 'filled',
	'light': 'filled',
	'outline': 'filled',
	'subtle': 'light',
	'filled': 'filled',
	'gradient': 'gradient',
	'gradient-outline': 'gradient',
} as const

export type ActiveVariantsMap = Record<keyof typeof DEFAULT_ACTIVE_VARIANTS, string>
