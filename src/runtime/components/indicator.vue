<script lang="ts">
import type { AnyString, Classes } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getRadius, getSize, getThemeColor, rem } from '@nui/utils'
import { computed } from 'vue'

import type { NuanceColor, NuanceRadius, NuanceSize } from '../types/theme.ts'
import type { BoxProps } from './box/box.vue'


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

export interface IndicatorProps extends Omit<BoxProps, 'inset' | 'display'> {
	/** Label displayed inside the indicator, for example, notification count */
	label?: string | number

	/**
	 * Indicator position relative to the target element
	 * @default 'top-end'
	 */
	position?: IndicatorPosition

	/**
	 *  Distance in pixels to offset the indicator from its default position, useful for elements with border-radius. Can be a number for uniform offset or an object with `x` and `y` properties for separate horizontal and vertical offsets
	 * @default 0
	 */
	offset?: number | { x: number, y: number }


	/** When `true`, keep the chip inside the component for rounded elements. */
	inset?: boolean

	/**
	 * Changes container display from block to inline-block, use when wrapping elements with fixed width
	 * @default false
	 *  */
	inline?: boolean

	/**
	 * Indicator width and height
	 * @default 10
	 */
	size?: number | NuanceSize | AnyString

	/**
	 * Key of `theme.radius` or any valid CSS value to set `border-radius`
	 * @default `'full'`
	 */
	radius?: NuanceRadius

	/**
	 * Key of `theme.colors` or any valid CSS color value
	 * @default theme.primaryColor
	 */
	color?: NuanceColor

	/** Adds border to the root element */
	withBorder?: boolean

	/** Hides the indicator when set */
	disabled?: boolean

	/**
	 * If set, the indicator has processing animation
	 * @default false
	 */
	processing?: boolean

	/** Indicator z-index @default 1 */
	zIndex?: string | number

	/** Maximum value to display. If label is a number greater than this value, it will be displayed as `{maxValue}+` */
	maxValue?: number

	/**
	 * Determines whether indicator with label `0` should be displayed
	 * @default true
	 */
	showZero?: boolean

	classes?: Classes<'root' | 'indicator'>
}

function getPositionVariables(
	_position: IndicatorPosition = 'top-end',
	offset: number | { x: number, y: number } = 0,
) {
	const variables: Record<IndicatorPosVars, string | undefined> = {
		'--indicator-top': undefined,
		'--indicator-bottom': undefined,
		'--indicator-left': undefined,
		'--indicator-right': undefined,
		'--indicator-translate-x': undefined,
		'--indicator-translate-y': undefined,
	}

	const offsetX = typeof offset === 'number' ? offset : offset.x
	const offsetY = typeof offset === 'number' ? offset : offset.y

	const _offsetX = rem(offsetX)
	const _offsetY = rem(offsetY)
	const [position, placement] = _position.split('-')

	if (position === 'top') {
		variables['--indicator-top'] = _offsetY
		variables['--indicator-translate-y'] = '-50%'
	}

	if (position === 'middle') {
		variables['--indicator-top'] = '50%'
		variables['--indicator-translate-y'] = '-50%'
	}

	if (position === 'bottom') {
		variables['--indicator-bottom'] = _offsetY
		variables['--indicator-translate-y'] = '50%'
	}

	if (placement === 'start') {
		variables['--indicator-left'] = _offsetX
		variables['--indicator-translate-x'] = '-50%'
	}

	if (placement === 'center') {
		variables['--indicator-left'] = '50%'
		variables['--indicator-translate-x'] = '-50%'
	}

	if (placement === 'end') {
		variables['--indicator-right'] = _offsetX
		variables['--indicator-translate-x'] = '50%'
	}

	return variables
}
</script>

<script setup lang='ts'>
import Box from './box/box.vue'


const {
	label,
	radius,
	color,
	position = 'top-end',
	offset = 0,
	showZero = true,
	inset = false,
	size,
	classes,
	c,
	zIndex = 1,
	disabled,
	withBorder,
	processing,
	maxValue,
	inline,
	mod,
	...rest
} = defineProps<IndicatorProps>()

const shouldHideZero = computed(() =>
	!showZero && (label === 0 || label === '0'))

const formattedLabel = computed(() =>
	maxValue !== undefined && typeof label === 'number' && label > maxValue
		? maxValue
		: label)

const style = useVarsResolver<IndicatorCssVars>(theme => ({
	root: {
		'--indicator-color': color ? getThemeColor(color, theme) : undefined,
		'--indicator-text-color': c ? getThemeColor(c, theme) : undefined,
		'--indicator-size': getSize(size, 'indicator-size'),
		'--indicator-radius': radius === undefined ? undefined : getRadius(radius),
		'--indicator-z-index': zIndex?.toString(),
		...getPositionVariables(position, offset),
	},
}))
</script>

<template>
	<Box
		v-bind='rest'
		:class='[$style.root, classes?.root]'
		:mod='[{ inline }, mod]'
		:style='style.root'
	>
		<Box
			v-if='!disabled && !shouldHideZero'
			:class='[$style.indicator, classes?.indicator]'
			:mod='{
				"with-label": !!label || $slots?.label,
				"with-border": withBorder,
				processing,
				inset,
			}'
		>
			<slot name='label' :label='formattedLabel'>
				{{ formattedLabel }}
			</slot>
		</Box>
		<slot />
	</Box>
</template>

<style module>
.root {
	--indicator-size-xs: rem(6px);
	--indicator-size-sm: rem(7px);
	--indicator-size-md: rem(8px);
	--indicator-size-lg: rem(9px);
	--indicator-size-xl: rem(10px);

	--indicator-size: var(--indicator-size-md);
	--indicator-color: var(--color-primary-filled);

	position: relative;

	display: block;

	&:where([data-inline]) {
		display: inline-block;
	}
}

.indicator {
	position: absolute;
	z-index: var(--indicator-z-index, 200);
	top: var(--indicator-top);
	right: var(--indicator-right);
	bottom: var(--indicator-bottom);
	left: var(--indicator-left);
	transform: translate(var(--indicator-translate-x), var(--indicator-translate-y));

	display: flex;
	align-items: center;
	justify-content: center;

	min-width: var(--indicator-size);
	height: var(--indicator-size);
	border-radius: var(--indicator-radius, 1000rem);

	font-size: var(--font-size-xs);
	color: var(--indicator-text-color, var(--color-white));
	white-space: nowrap;

	background-color: var(--indicator-color);

	&::before {
		content: '';

		position: absolute;
		z-index: -1;
		inset: 0;

		border-radius: var(--indicator-radius, 1000rem);

		background-color: var(--indicator-color);
	}

	&:where([data-with-label]) {
		padding-inline: calc(var(--spacing-xs) / 2);
	}

	&:where([data-with-border]) {
		border: 2px solid var(--color-body);
	}

	&:where([data-inset]) {
		--indicator-translate-x: 0;
		--indicator-translate-y: 0;
	}

	&[data-processing] {
		&::before {
			animation: processing 1000ms linear infinite;
		}
	}
}

@keyframes processing {
	0% {
		transform: scale(0);

		opacity: 0.6;
	}

	100% {
		transform: scale(2.8);

		opacity: 0;
	}
}
</style>
