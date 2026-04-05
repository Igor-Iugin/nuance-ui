import type { AlignedPlacement, OffsetOptions, Side, Strategy } from '@floating-ui/vue'
import type { NuanceRadius, NuanceShadow } from '@nui/types'
import type { CSSProperties } from 'vue'


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

	/** Border radius @default `theme.defaultRadius` */
	radius?: NuanceRadius

	/** Shadow token */
	shadow?: NuanceShadow

	/** Disables the component */
	disabled?: boolean

	/** Changes floating ui [position strategy](https://floating-ui.com/docs/usefloating#strategy) @default `'absolute'` */
	floatingStrategy?: Strategy
}


export interface PopoverModel {
	/** Open state */
	open: boolean
}

export interface PopoverEmits {
	/** Fired when the popover opens */
	open: []
	/** Fired when the popover closes */
	close: []
}
