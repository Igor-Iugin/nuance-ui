<script setup lang='ts' generic='T extends TimelineItem'>
import type {
	AnyString,
	Classes,
	DynamicSlots,
	NuanceColor,
	NuanceRadius,
	NuanceSize,
	SlotProps,
} from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getRadius, getSize, getSpacing, getThemeColor, rem } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from './box.vue'

import Box from './box.vue'


export interface TimelineItem {
	/** Unique item id */
	id: string

	label: string
	active?: boolean
	description?: string

	/** Icon inside bullet */
	icon?: string

	/**
	 * Key of `theme.radius` or any valid CSS value to set `border-radius`,
	 * numbers are converted to rem
	 * @default 'xl'
	 */
	radius?: NuanceRadius

	/**
	 * Key of `theme.colors` or any valid CSS color to control active item colors
	 * @default theme.primaryColor
	 */
	color?: NuanceColor

	/** Controls line border style @default 'solid' */
	lineVariant?: 'solid' | 'dashed' | 'dotted'

	/** Value used for model-based active state */
	value?: string | number

	slot?: string

	[key: string]: any
}

export interface TimelineVars {
	root:
		| '--tl-line-width'
		| '--tl-size'
		| '--tl-color'
		| '--tl-radius'
		| '--tl-gap'
}

export type TimelineSlots<T extends TimelineItem = TimelineItem> = {
	bullet?: SlotProps<T>
	label?: SlotProps<T>
	content?: SlotProps<T>
} & DynamicSlots<T, 'bullet' | 'label' | 'content', { item: T }>

export interface TimelineEmits<T extends TimelineItem = TimelineItem> {
	select: [item: T, event: Event]
}

export interface TimelineProps<T extends TimelineItem> extends BoxProps {
	items: T[]

	/**
	 * Key of `theme.colors` or any valid CSS color to control active item colors
	 * @default theme.primaryColor
	 */
	color?: NuanceColor

	/**
	 * Key of `theme.radius` or any valid CSS value to set `border-radius`, numbers are converted to rem
	 * @default 'full'
	 */
	radius?: NuanceRadius

	/** Size of the bullet @default 20 */
	size?: NuanceSize | AnyString

	/** Position of content relative to the bullet @default 'left' */
	align?: 'right' | 'left'

	/** Control width of the line */
	lineWidth?: number | string

	/** Gap between items (padding-bottom on each non-last item) */
	gap?: number | string

	/** If set, the active items direction is reversed without reversing items order @default false */
	reverse?: boolean

	/** @default 'vertical' */
	orientation?: 'horizontal' | 'vertical'

	/**
	 * Key of item used to match against model value.
	 * @default 'value'
	 */
	valueKey?: keyof T & string

	classes?: Classes<
		| 'root'
		| 'item'
		| 'body'
		| 'content'
		| 'bullet'
		| 'label'
	>
}

const {
	items,
	radius = 'full',
	align = 'left',
	size,
	lineWidth = 4,
	gap,
	color,
	classes,
	mod,
	reverse,
	orientation = 'vertical',
	valueKey = 'value',
} = defineProps<TimelineProps<T>>()

defineEmits<TimelineEmits<T>>()
defineSlots<TimelineSlots<T>>()

const modelValue = defineModel<string | number | null>()
const style = useVarsResolver<TimelineVars>(theme => ({
	root: {
		'--tl-size': getSize(size, 'tl-size'),
		'--tl-line-width': rem(lineWidth),
		'--tl-radius': radius === undefined ? undefined : getRadius(radius),
		'--tl-color': color ? getThemeColor(color, theme) : undefined,
		'--tl-gap': getSpacing(gap),
	},
}))

const currentStepIx = computed(() => {
	const value = modelValue.value

	if (value == null)
		return -1

	if (typeof value === 'string') {
		return items.findIndex(item => item[valueKey] === value)
	}

	return reverse ? items.length - 1 - value : value
})

function getActive(ix: number): boolean {
	if (currentStepIx.value === -1)
		return false
	if (ix === currentStepIx.value)
		return true

	if (reverse) {
		return ix > currentStepIx.value
	}
	else {
		return ix < currentStepIx.value
	}
}
</script>

<template>
	<Box
		:style='style.root'
		:class='[$style.root, classes?.root]'
		:mod='[{ align, orientation }, mod]'
	>
		<Box
			v-for='(item, ix) in items'
			:key='item.id'
			:class='[$style.item, classes?.item]'
			:mod='{
				"active": getActive(ix),
				"line-active": getActive(ix),
			}'
			@click='$emit("select", item, $event)'
		>
			<Box
				:class='[$style.bullet, classes?.bullet]'
				:mod='{
					align,
					"active": getActive(ix),
					"with-child": !!item?.icon || !!$slots.bullet,
				}'
			>
				<slot name='bullet' :item>
					<Icon v-if='item?.icon' :name='item.icon' />
				</slot>
			</Box>

			<div :class='[$style.body, classes?.body]'>
				<div v-if='item.label' :class='[$style.label, classes?.label]'>
					<slot name='label' :item>
						{{ item?.label }}
					</slot>
				</div>
				<div :class='[$style.content, classes?.content]'>
					<slot name='content' :item>
						{{ item?.description }}
					</slot>
				</div>
			</div>
		</Box>
	</Box>
</template>

<style module>
.root {
	--tl-size-xs: 1rem;
	--tl-size-sm: 1.25rem;
	--tl-size-md: 1.5rem;
	--tl-size-lg: 1.75rem;
	--tl-size-xl: 2rem;

	--tl-size: var(--tl-size-md);

	--tl-offset: calc((var(--tl-size) - var(--tl-line-width)) / 2);
	--tl-line-width: .25rem;
	--tl-radius: 1000px;
	--tl-color: var(--color-primary-filled);
	--tl-gap: var(--spacing-xl);

	&:where([data-align='left']) {
		padding-inline-start: var(--tl-offset);
	}

	&:where([data-align='right']) {
		padding-inline-end: var(--tl-offset);
	}

	&:where([data-orientation='horizontal']) {
		display: flex;
		flex-direction: row;

		padding-block-start: var(--tl-offset);
		padding-inline: 0;
	}
}

.item {
	--tli-bd-style: solid;
	--tli-bd-color: var(--color-primary-filled);

	--item-border: var(--tl-line-width) var(--tli-bd-style) var(--tli-bd-color);

	position: relative;

	color: var(--color-text);

	&::before {
		pointer-events: none;
		content: '';

		position: absolute;
		top: 0;
		right: var(--timeline-line-right, 0);
		bottom: 0;
		left: var(--timeline-line-left, 0);

		display: var(--timeline-line-display, none);

		border-inline-start: var(--item-border);

		.root[data-align='left'] & {
			--timeline-line-left: calc(var(--tl-line-width) * -1);
			--timeline-line-right: auto;

			@mixin rtl {
				--timeline-line-left: auto;
				--timeline-line-right: calc(var(--tl-line-width) * -1);
			}
		}

		.root[data-align='right'] & {
			--timeline-line-left: auto;
			--timeline-line-right: calc(var(--tl-line-width) * -1);

			@mixin rtl {
				--timeline-line-left: calc(var(--tl-line-width) * -1);
				--timeline-line-right: auto;
			}
		}
	}

	.root:where([data-align='left']) & {
		padding-inline-start: var(--tl-offset);

		text-align: left;
	}

	.root:where([data-align='right']) & {
		padding-inline-end: var(--tl-offset);

		text-align: right;
	}

	.root:where([data-orientation='horizontal']) & {
		flex: 1;

		padding-block-start: var(--tl-offset);
		padding-inline: 0;

		text-align: center;

		&::before {
			--timeline-line-top: calc((var(--tl-size) - var(--tl-line-width)) / 2);

			top: var(--timeline-line-top, 0);
			right: 0;
			bottom: auto;
			left: 0;

			height: var(--tl-line-width);
			border-top: var(--item-border);
			border-inline-start: none;
		}

		&:where(:not(:last-of-type)) {
			--timeline-line-display: block;

			padding-bottom: 0;
		}
	}

	@mixin where-light {
		--tli-bd-color: var(--color-gray-3);
	}

	@mixin where-dark {
		--tli-bd-color: var(--color-dark-4);
	}

	&:where([data-line-active]) {
		--tli-bd-color: var(--tl-color);
	}

	&:where(:not(:last-of-type)) {
		--timeline-line-display: block;

		padding-bottom: var(--tl-gap);
	}

	.root:where([data-orientation='horizontal']) &:where(:not(:first-of-type)) {
		padding-bottom: 0;
	}
}

.bullet {
	--tl-bullet-offset: calc((var(--tl-size) / 2 + var(--tl-line-width) / 2) * -1);

	position: absolute;
	top: 0;

	display: flex;
	align-items: center;
	justify-content: center;

	width: var(--tl-size);
	height: var(--tl-size);
	border: var(--tl-line-width) solid;
	border-radius: var(--tli-radius, var(--tl-radius));

	color: var(--color-text);

	background-color: var(--color-body);

	@mixin where-light {
		border-color: var(--color-gray-3);
	}

	@mixin where-dark {
		border-color: var(--color-dark-4);
	}

	.root:where([data-align='left']) & {
		right: auto;
		left: var(--tl-bullet-offset);

		@mixin where-rtl {
			right: var(--tl-bullet-offset);
			left: auto;
		}
	}

	.root:where([data-align='right']) & {
		right: var(--tl-bullet-offset);
		left: auto;

		@mixin where-rtl {
			right: auto;
			left: var(--tl-bullet-offset);
		}
	}

	.root:where([data-orientation='horizontal']) & {
		--tl-bullet-offset: 0;
	}

	&:where([data-with-child]) {
		border-width: var(--tl-line-width);

		@mixin where-light {
			background-color: var(--color-gray-3);
		}

		@mixin where-dark {
			background-color: var(--color-dark-4);
		}
	}

	&:where([data-active]) {
		border-color: var(--tli-color, var(--tl-color));

		color: var(--tl-icon-color, var(--color-white));

		background-color: var(--color-white);

		&:where([data-with-child]) {
			color: var(--tl-icon-color, var(--color-white));

			background-color: var(--tli-color, var(--tl-color));
		}
	}
}

.body {
	.root:where([data-align='left']) & {
		padding-inline-start: var(--tl-offset);

		text-align: left;

		@mixin where-rtl {
			text-align: right;
		}
	}

	.root:where([data-align='right']) & {
		padding-inline-end: var(--tl-offset);

		text-align: right;

		@mixin where-rtl {
			text-align: left;
		}
	}

	.root:where([data-orientation='horizontal']) & {
		padding-block-start: calc(var(--tl-offset) + var(--spacing-xs));
		padding-inline: 0;
	}
}

.label {
	font-weight: 600;
	line-height: var(--tl-size);
}

.content {
	color: var(--color-dimmed);
}
</style>
