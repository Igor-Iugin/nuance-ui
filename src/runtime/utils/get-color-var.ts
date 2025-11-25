import type { UiKitColor, UiKitColorShade } from '@types'


export function getColorVar(color: UiKitColor, shade: UiKitColorShade = 4) {
	if (color === 'white' || color === 'black') {
		return `var(--color-${color})`
	}

	return `var(--color-${color}-${shade})`
}
