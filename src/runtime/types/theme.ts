import type { AnyString } from '.'

/** Standard Nuance size token. */
export type NuanceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type NuanceBreakpoint = NuanceSize | 'base'
export type NuanceFontSize = NuanceSize
export type NuanceRadius = NuanceSize | 'full' | number
export type NuanceSpacing = NuanceSize | number
export type NuanceShadow = NuanceSize
export type NuanceLineHeight = NuanceSize

/** Numeric shade index within a color palette, from lightest (0) to darkest (9). */
export type NuanceColorShade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type ShadedColor
	= `dark.${NuanceColorShade}`
		| `slate.${NuanceColorShade}`
		| `gray.${NuanceColorShade}`
		| `red.${NuanceColorShade}`
		| `pink.${NuanceColorShade}`
		| `grape.${NuanceColorShade}`
		| `violet.${NuanceColorShade}`
		| `indigo.${NuanceColorShade}`
		| `blue.${NuanceColorShade}`
		| `cyan.${NuanceColorShade}`
		| `green.${NuanceColorShade}`
		| `lime.${NuanceColorShade}`
		| `yellow.${NuanceColorShade}`
		| `orange.${NuanceColorShade}`
		| `teal.${NuanceColorShade}`
		| `primary.${NuanceColorShade}`

export type NuanceDefaultThemeColor
	= 'dark'
		| 'slate'
		| 'gray'
		| 'red'
		| 'pink'
		| 'grape'
		| 'violet'
		| 'indigo'
		| 'blue'
		| 'cyan'
		| 'green'
		| 'lime'
		| 'yellow'
		| 'orange'
		| 'teal'
		| 'black'
		| 'white'
		| 'primary'

/** Theme color token, optionally suffixed with a shade (e.g. `blue.6`). */
export type NuanceColor = NuanceDefaultThemeColor | ShadedColor

/** Resolved color scheme currently applied to the document. */
export type NuanceTheme = 'light' | 'dark'

/** Linear gradient definition. */
export interface NuanceGradient {
	/** Fallback background color rendered behind the gradient. */
	bg?: NuanceColor | AnyString

	/** Start color. */
	from: NuanceColor | AnyString

	/** End color. */
	to: NuanceColor | AnyString

	/** Gradient angle in degrees. */
	deg?: number
}
