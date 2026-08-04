<script lang="ts">
import type { StyleProps } from './box/types.ts'

import Avatar from './avatar/avatar.vue'
import Group from './group.vue'
import Text from './text.vue'


type Position = 'top' | 'middle' | 'bottom'
type Placement = 'start' | 'center' | 'end'

export type IndicatorPosition = `${Position}-${Placement}`

export type IndicatorPosVars
	= | '--indicator-top'
		| '--indicator-bottom'
		| '--indicator-left'
		| '--indicator-right'
		| '--indicator-translate-x'
		| '--indicator-translate-y'

export interface IndicatorCssVars {
	root:
		| '--indicator-color'
		| '--indicator-text-color'
		| '--indicator-size'
		| '--indicator-radius'
		| '--indicator-z-index'
		| IndicatorPosVars
}

export interface IndicatorProps extends StyleProps {
	/** Indicator position relative to the target element @default 'top-end' */
	position?: IndicatorPosition

	/** Distance in pixels to offset the indicator from its default position, useful for elements with border-radius. Can be a number for uniform offset or an object with `x` and `y` properties for separate horizontal and vertical offsets @default 0 */
	offset?: number | { x: number, y: number }

	/** Changes container display from block to inline-block, use when wrapping elements with fixed width @default false */
	inline?: boolean

	/** Indicator width and height @default 10 */
	size?: number | string

	/** Label displayed inside the indicator, for example, notification count */
	label?: React.ReactNode

	/** Key of `theme.radius` or any valid CSS value to set `border-radius` @default 100 */
	radius?: MantineRadius

	/** Key of `theme.colors` or any valid CSS color value @default theme.primaryColor */
	color?: MantineColor

	/** Adds border to the root element */
	withBorder?: boolean

	/** Hides the indicator when set */
	disabled?: boolean

	/** If set, the indicator has processing animation @default false */
	processing?: boolean

	/** Indicator z-index @default 200 */
	zIndex?: string | number

	/** If set, adjusts text color based on background color */
	autoContrast?: boolean

	/** Maximum value to display. If label is a number greater than this value, it will be displayed as `{maxValue}+` */
	maxValue?: number

	/** Determines whether indicator with label `0` should be displayed @default true */
	showZero?: boolean
}
</script>

<script setup lang='ts'>
import css from './avatar.module.css'


const {
	name,
	radius,
	placeholder,
	color,
	variant,
	allowedInitialsColors,
	gradient,
	size,
	classes,
	mod,
	src,
	...rest
} = defineProps<IndicatorProps>()
</script>

<template>
	<Group :class='[css.root, classes?.root]'>
		<Avatar>
			<slot />
		</Avatar>
		<div>
			<Text>{{ name }}</Text>
		</div>
	</Group>
</template>
