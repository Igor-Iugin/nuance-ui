export type UiKitSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type UiKitBreakpointsValues = Record<UiKitSize | 'base', string>
export type UiKitFontSizesValues = Record<UiKitSize, string>
export type UiKitRadiusValues = Record<UiKitSize | 'full', string>
export type UiKitSpacingValues = Record<UiKitSize, string>
export type UiKitShadowsValues = Record<UiKitSize, string>
export type UiKitLineHeightValues = Record<UiKitSize, string>

export type UiKitBreakpoint = keyof UiKitBreakpointsValues
export type UiKitFontSize = keyof UiKitFontSizesValues
export type UiKitRadius = keyof UiKitRadiusValues | number
export type UiKitSpacing = keyof UiKitSpacingValues | number
export type UiKitShadow = keyof UiKitShadowsValues
export type UiKitLineHeight = keyof UiKitLineHeightValues

export type UiKitColorShade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type ShadedColor
	= | `dark.${UiKitColorShade}`
		| `slate.${UiKitColorShade}`
		| `gray.${UiKitColorShade}`
		| `red.${UiKitColorShade}`
		| `pink.${UiKitColorShade}`
		| `grape.${UiKitColorShade}`
		| `violet.${UiKitColorShade}`
		| `indigo.${UiKitColorShade}`
		| `blue.${UiKitColorShade}`
		| `cyan.${UiKitColorShade}`
		| `green.${UiKitColorShade}`
		| `lime.${UiKitColorShade}`
		| `yellow.${UiKitColorShade}`
		| `orange.${UiKitColorShade}`
		| `teal.${UiKitColorShade}`

export type UiKitDefaultThemeColor
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

export type UiKitColor = UiKitDefaultThemeColor | ShadedColor

export type UiKitTheme = 'light' | 'dark'

export interface UiKitGradient {
	bg?: UiKitColor | string
	from: UiKitColor | string
	to: UiKitColor | string
	deg?: number
}
