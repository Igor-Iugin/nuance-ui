import type { NuanceGradient, NuanceTheme } from '@nui/types'

import { DEFAULT_GRADIENT } from './const'
import { parseThemeColor } from './parse-theme-color'


/**
 * Builds a `linear-gradient(...)` CSS value from a NuanceGradient descriptor.
 *
 * Missing fields fall back to `DEFAULT_GRADIENT`.
 */
export function getGradient(gradient: NuanceGradient | undefined, theme: NuanceTheme) {
	const merged = {
		from: gradient?.from || DEFAULT_GRADIENT.from,
		to: gradient?.to || DEFAULT_GRADIENT.to,
		deg: gradient?.deg ?? DEFAULT_GRADIENT.deg ?? 0,
	} satisfies NuanceGradient

	const fromColor = parseThemeColor({ color: merged.from, theme })
	const toColor = parseThemeColor({ color: merged.to, theme })

	return `linear-gradient(${merged.deg}deg, ${fromColor.value} 0%, ${toColor.value} 100%)`
}

/**
 * Builds a two-layer gradient that renders a solid background with a colored
 * border produced by a gradient.
 *
 * The first layer is the solid background color, the second layer is the
 * gradient used as a border effect.
 */
export function getGradientOutline(gradient: NuanceGradient | undefined, theme: NuanceTheme) {
	const merged = {
		bg: gradient?.bg || DEFAULT_GRADIENT.bg,
		from: gradient?.from || DEFAULT_GRADIENT.from,
		to: gradient?.to || DEFAULT_GRADIENT.to,
		deg: gradient?.deg ?? DEFAULT_GRADIENT.deg ?? 0,
	} satisfies NuanceGradient

	const fromColor = parseThemeColor({ color: merged.from, theme })
	const toColor = parseThemeColor({ color: merged.to, theme })
	const bgColor = parseThemeColor({ color: merged.bg, theme })

	return `linear-gradient(${bgColor.value}, ${bgColor.value}),
	 linear-gradient(${merged.deg}deg, ${fromColor.value} 20%, ${toColor.value} 120%)`
}
