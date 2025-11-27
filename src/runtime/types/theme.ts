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

export type NuanceColor = NuanceDefaultThemeColor | ShadedColor

export type NuanceTheme = 'light' | 'dark'

export interface UiKitGradient {
	bg?: NuanceColor | string
	from: NuanceColor | string
	to: NuanceColor | string
	deg?: number
}
