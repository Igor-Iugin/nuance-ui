import type { NuanceColor, NuanceColorShade, NuanceDefaultThemeColor, NuanceTheme } from '@nui/types'

import { getColorVar } from '../../utils/get-color-var'


interface ParseThemeColorResult {
	color: string
	value: string
	shade: NuanceColorShade | undefined
	variable: `--${string}` | undefined
	isThemeColor: boolean
}

const themeColors: (NuanceDefaultThemeColor | 'primary')[] = [
	'dark',
	'slate',
	'gray',
	'red',
	'pink',
	'grape',
	'violet',
	'indigo',
	'blue',
	'cyan',
	'green',
	'lime',
	'yellow',
	'orange',
	'teal',
	'black',
	'white',
	'primary',
]

export function parseThemeColor({
	color = 'primary',
	theme,
}: {
	color: unknown
	theme: NuanceTheme
}): ParseThemeColorResult {
	if (typeof color !== 'string') {
		throw new TypeError(
			`[@ui-kit] Failed to parse color. Expected color to be a string, instead got ${typeof color}`,
		)
	}

	if (color === 'dimmed') {
		return {
			color,
			value: theme === 'dark' ? getColorVar('dark', 2) : getColorVar('gray', 7),
			shade: undefined,
			variable: '--color-dimmed',
			isThemeColor: false,
		}
	}

	if (color === 'white' || color === 'black') {
		return {
			color,
			value: color === 'white' ? 'var(--color-white)' : 'var(--color-black)',
			shade: undefined,
			variable: `--color-${color}`,
			isThemeColor: false,
		}
	}

	const [_color, shade] = color.split('.') as [NuanceColor, NuanceColorShade]
	const colorShade = shade ? (Number(shade) as NuanceColorShade) : undefined
	const isThemeColor = themeColors.includes(_color as any)

	if (isThemeColor) {
		const colorValue = getColorVar(_color, colorShade)

		return {
			color: _color,
			value: colorValue,
			shade: colorShade,
			isThemeColor,
			variable: shade
				? `--color-${_color}-${colorShade}`
				: `--color-${_color}-filled`,
		}
	}

	return {
		color: _color,
		value: color,
		isThemeColor,
		shade,
		variable: undefined,
	}
}

export function getThemeColor(color: string | undefined, theme: NuanceTheme) {
	const parsed = parseThemeColor({ color, theme })
	return parsed.variable ? `var(${parsed.variable})` : color!
}
