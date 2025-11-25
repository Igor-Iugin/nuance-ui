import type { UiKitGradient, UiKitTheme } from '@types'

import { DEFAULT_GRADIENT } from '../../const'
import { parseThemeColor } from '../parse-theme-color/parse-theme-color'


export function getGradient(gradient: UiKitGradient | undefined, theme: UiKitTheme) {
	const merged = {
		from: gradient?.from || DEFAULT_GRADIENT.from,
		to: gradient?.to || DEFAULT_GRADIENT.to,
		deg: gradient?.deg ?? DEFAULT_GRADIENT.deg ?? 0,
	} satisfies UiKitGradient

	const fromColor = parseThemeColor({ color: merged.from, theme })
	const toColor = parseThemeColor({ color: merged.to, theme })

	return `linear-gradient(${merged.deg}deg, ${fromColor.value} 0%, ${toColor.value} 100%)`
}

export function getGradientOutline(gradient: UiKitGradient | undefined, theme: UiKitTheme) {
	const merged = {
		bg: gradient?.bg || DEFAULT_GRADIENT.bg,
		from: gradient?.from || DEFAULT_GRADIENT.from,
		to: gradient?.to || DEFAULT_GRADIENT.to,
		deg: gradient?.deg ?? DEFAULT_GRADIENT.deg ?? 0,
	} satisfies UiKitGradient

	const fromColor = parseThemeColor({ color: merged.from, theme })
	const toColor = parseThemeColor({ color: merged.to, theme })
	const bgColor = parseThemeColor({ color: merged.bg, theme })

	return `linear-gradient(${bgColor.value}, ${bgColor.value}),
	 linear-gradient(${merged.deg}deg, ${fromColor.value} 20%, ${toColor.value} 120%)`
}
