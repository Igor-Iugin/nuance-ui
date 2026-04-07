import type {
	CssVariable,
	NuanceColor,
	NuanceColorShade,
	NuanceDefaultThemeColor,
	NuanceTheme,
} from '@nui/types'

import { getColorVar } from './get-color-var'


interface ParseThemeColorResult {
	/** Color name without its shade suffix. */
	color: string
	/** Resolved CSS value, typically a `var(...)` reference. */
	value: string
	/** Parsed shade index, or `undefined` when the color has no shade. */
	shade: NuanceColorShade | undefined
	/** Matching CSS custom property, or `undefined` for non-theme colors. */
	variable: CssVariable | undefined
	/** `true` when the color belongs to the Nuance theme palette. */
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


/**
 * Parses a color descriptor (`'red.5'`, `'primary'`, `'dimmed'`, a raw CSS
 * color, ...) into its resolved CSS value plus metadata.
 *
 * Theme colors produce a `var(...)` reference and expose the matching
 * custom property via `variable`.
 *
 * The special `dimmed` keyword picks a muted gray depending on the current theme.
 *
 * Arbitrary CSS colors are returned as-is with `isThemeColor: false`.
 */
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

/**
 * Resolves a color descriptor to a usable CSS value.
 *
 * Theme colors are returned as a `var(...)` reference; arbitrary CSS colors
 * are returned unchanged.
 */
export function getThemeColor(color: string | undefined, theme: NuanceTheme) {
	const parsed = parseThemeColor({ color, theme })
	return parsed.variable ? `var(${parsed.variable})` : color!
}
