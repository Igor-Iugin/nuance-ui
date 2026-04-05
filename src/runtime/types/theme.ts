/** Standard Nuance size token. */
export type NuanceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type NuanceBreakpointsValues = Record<NuanceSize | 'base', string>
export type NuanceFontSizesValues = Record<NuanceSize, string>
export type NuanceRadiusValues = Record<NuanceSize | 'full', string>
export type NuanceSpacingValues = Record<NuanceSize, string>
export type NuanceShadowsValues = Record<NuanceSize, string>
export type NuanceLineHeightValues = Record<NuanceSize, string>

export type NuanceBreakpoint = keyof NuanceBreakpointsValues
export type NuanceFontSize = keyof NuanceFontSizesValues
export type NuanceRadius = keyof NuanceRadiusValues | number
export type NuanceSpacing = keyof NuanceSpacingValues | number
export type NuanceShadow = keyof NuanceShadowsValues
export type NuanceLineHeight = keyof NuanceLineHeightValues

/** Numeric shade index within a color palette, from lightest (0) to darkest (9). */
export type NuanceColorShade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type ShadedColor
	= | `dark.${NuanceColorShade}`
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
	= | 'dark'
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
	bg?: NuanceColor | string
	/** Start color. */
	from: NuanceColor | string
	/** End color. */
	to: NuanceColor | string
	/** Gradient angle in degrees. */
	deg?: number
}
