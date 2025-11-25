import type { AlignedPlacement, OffsetOptions, Side, Strategy } from '@floating-ui/vue'
import type { CSSProperties } from 'vue'

import type { UiKitRadius, UiKitShadow } from '~/src/runtime/types/theme'


export type ArrowPosition = 'center' | 'side'

export type PopoverWidth = 'target' | CSSProperties['width'] | null


export interface PopoverProps {
	/** Dropdown position relative to the target element @default `'bottom'` */
	placement?: Side | AlignedPlacement

	/** Offset of the dropdown element @default `8` */
	offset?: OffsetOptions

	/** If set, the dropdown is not unmounted from the DOM when hidden. `display: none` styles are added instead. */
	keepMounted?: boolean

	/** Dropdown width, or `'target'` to make dropdown width the same as target element @default `'max-content'` */
	width?: PopoverWidth

	/** Determines whether component should have an arrow @default `false` */
	withArrow?: boolean

	/** Arrow size in px @default `7` */
	arrowSize?: number

	/** Arrow offset in px @default `5` */
	arrowOffset?: number

	/** Arrow `border-radius` in px @default `0` */
	arrowRadius?: number

	/** Arrow position */
	arrowPosition?: ArrowPosition

	/** Key of `theme.radius` or any valid CSS value to set border-radius @default `theme.defaultRadius` */
	radius?: UiKitRadius

	/** Key of `theme.shadows` or any other valid CSS `box-shadow` value */
	shadow?: UiKitShadow

	/** If set, popover dropdown will not be rendered */
	disabled?: boolean

	/** Changes floating ui [position strategy](https://floating-ui.com/docs/usefloating#strategy) @default `'absolute'` */
	floatingStrategy?: Strategy
}


export interface PopoverModel {
	open: boolean
}

export interface PopoverEmits {
	/** Event handler called when the popover open */
	open: []
	/** Event handler called when the popover closed */
	close: []
}
