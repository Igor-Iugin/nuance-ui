import type { NuanceColor, NuanceColorShade } from '@nui/types'


export function getColorVar(color: NuanceColor, shade: NuanceColorShade = 4) {
	if (color === 'white' || color === 'black') {
		return `var(--color-${color})`
	}

	return `var(--color-${color}-${shade})`
}
