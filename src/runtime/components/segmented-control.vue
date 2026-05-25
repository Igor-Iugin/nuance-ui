<script setup lang='ts'>
import type { AnyString, NuanceColor, NuanceRadius, NuanceSize } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getFontSize, getRadius, getSize, getThemeColor } from '@nui/utils'
import { useTemplateRefsList } from '@vueuse/core'
import { computed, useId, useTemplateRef } from 'vue'

import type { BoxProps } from './box.vue'

import Box from './box.vue'
import FloatingIndicator from './floating-indicator.vue'


interface SegmentedControlVars {
	root:
		| '--sc-radius'
		| '--sc-color'
		| '--sc-font-size'
		| '--sc-padding'
		| '--sc-shadow'
		| '--sc-transition-duration'
		| '--sc-transition-timing-function'
}

export interface SegmentedControlItem {
	value: string
	label: string
	disabled?: boolean
	icon?: string
}

export interface SegmentedControlProps extends BoxProps {
	/** Items to render as controls */
	data: (string | SegmentedControlItem)[]

	/** Component size @default 'md' */
	size?: NuanceSize | AnyString

	/** Border radius */
	radius?: NuanceRadius

	/** Color from theme */
	color?: NuanceColor

	/** Indicator `transition-duration` in ms */
	transitionDuration?: number

	/** Indicator `transition-timing-function` */
	transitionTimingFunction?: string

	/** Fills parent width */
	fullWidth?: boolean

	/** Component orientation */
	orientation?: 'horizontal' | 'vertical'

	/** Disables the component */
	disabled?: boolean

	/** Prevents value changes */
	readOnly?: boolean

	/**
	 * Show borders between items
	 * @default `true`
	 */
	withItemsBorders?: boolean
}

const {
	is,
	mod,
	data,
	size,
	radius,
	color,
	transitionDuration,
	transitionTimingFunction,
	fullWidth,
	orientation = 'horizontal',
	disabled,
	readOnly,
	withItemsBorders = true,
} = defineProps<SegmentedControlProps>()

const value = defineModel<string>()

const items = computed<SegmentedControlItem[]>(() =>
	data.map(item => typeof item === 'string' ? { value: item, label: item } : item),
)

if (value.value === undefined) {
	const first = items.value.find(i => !i.disabled)
	if (first)
		value.value = first.value
}

const groupName = useId()

const rootRef = useTemplateRef<HTMLElement>('root')
const labelRefs = useTemplateRefsList<HTMLElement>()

const activeTarget = computed(() => {
	if (value.value === undefined)
		return null

	const index = items.value.findIndex(i => i.value === value.value)
	return index !== -1 ? (labelRefs.value[index] ?? null) : null
})

const style = useVarsResolver<SegmentedControlVars>(theme => ({
	root: {
		'--sc-radius': getRadius(radius),
		'--sc-color': color ? getThemeColor(color, theme) : undefined,
		'--sc-shadow': color ? undefined : 'var(--shadow-xs)',
		'--sc-transition-duration': transitionDuration === undefined ? undefined : `${transitionDuration}ms`,
		'--sc-transition-timing-function': transitionTimingFunction,
		'--sc-padding': getSize(size, 'sc-padding'),
		'--sc-font-size': getFontSize(size),
	},
}))
</script>

<template>
	<Box
		:is
		ref='root'
		:style='style.root'
		:class='$style.root'
		:mod='[{
			"full-width": fullWidth,
			orientation,
			disabled,
			"with-items-borders": withItemsBorders,
		}, mod]'
		role='radiogroup'
	>
		<FloatingIndicator
			v-if='typeof value !== undefined'
			:target='activeTarget'
			:parent='rootRef'
			:class='$style.indicator'
			:orientation
		/>

		<Box
			v-for='item in items'
			:key='item.value'
			:class='$style.control'
			:mod='{ active: value === item.value, orientation }'
		>
			<input
				:id='`${groupName}-${item.value}`'
				:key='`${item.value}-input`'
				:class='$style.input'
				type='radio'
				:name='groupName'
				:value='item.value'
				:checked='value === item.value'
				:disabled='disabled || item.disabled'
				@change='!readOnly && (value = item.value)'
			>

			<Box
				is='label'
				:ref='labelRefs.set'
				:for='`${groupName}-${item.value}`'
				:class='$style.label'
				:style='{
					"--sc-label-color": !!color && "var(--color-white)",
				}'
				:mod='{
					"active": value === item.value && !(disabled || item.disabled),
					"disabled": disabled || item.disabled,
					"read-only": readOnly,
				}'
			>
				<span :class='$style.innerLabel'>
					<Icon v-if='item?.icon' :name='item.icon' />
					{{ item.label }}
				</span>
			</Box>
		</Box>
	</Box>
</template>

<style module>
.root {
	--sc-padding-xs: 2px 6px;
	--sc-padding-sm: 3px 10px;
	--sc-padding-md: 4px 14px;
	--sc-padding-lg: 7px 16px;
	--sc-padding-xl: 10px 20px;

	--sc-padding: var(--sc-padding-md);
	--sc-radius: var(--radius-sm);

	--sc-transition-duration: 200ms;
	--sc-transition-timing-function: ease;
	--sc-font-size: var(--font-size-md);

	position: relative;

	overflow: hidden;
	display: inline-flex;
	flex-direction: row;

	width: auto;
	padding: 4px;
	border-radius: var(--sc-radius, var(--radius-default));

	&:where([data-full-width]) {
		display: flex;
	}

	&:where([data-orientation='vertical']) {
		display: flex;
		flex-direction: column;

		width: max-content;

		&:where([data-full-width]) {
			width: auto;
		}
	}

	@mixin where-light {
		background-color: var(--color-gray-1);
	}

	@mixin where-dark {
		background-color: var(--color-dark-8);
	}
}

.indicator {
	position: absolute;
	z-index: 1;

	display: block;

	border-radius: var(--sc-radius, var(--radius-md));

	&:where([data-orientation='horizontal']) {
		top: 4px;
		bottom: 4px;
	}

	&:where([data-orientation='vertical']) {
		right: 4px;
		left: 4px;
	}

	@mixin where-light {
		background-color: var(--sc-color, var(--color-white));
		box-shadow: var(--sc-shadow, none);
	}

	@mixin where-dark {
		background-color: var(--sc-color, var(--color-dark-5));
		box-shadow: none;
	}
}

.label {
	cursor: pointer;
	user-select: none;

	overflow: hidden;
	display: block;

	padding: var(--sc-padding);
	border-radius: var(--sc-radius, var(--radius-md));

	font-size: var(--sc-font-size);
	font-weight: 500;
	text-align: center;
	text-overflow: ellipsis;
	white-space: nowrap;

	/* outline is controlled by .input */
	outline: var(--segmented-control-outline, none);

	transition: color var(--sc-transition-duration) var(--sc-transition-timing-function);
	-webkit-tap-highlight-color: transparent;

	@mixin where-light {
		color: var(--color-gray-7);
	}

	@mixin where-dark {
		color: var(--color-dark-1);
	}

	&:where([data-read-only]) {
		cursor: default;
	}

	&:where([data-active]) {
		@mixin where-light {
			color: var(--sc-label-color, var(--color-black));
		}

		@mixin where-dark {
			color: var(--sc-label-color, var(--color-white));
		}

		&::before {
			content: '';

			position: absolute;
			z-index: 0;
			inset: 0;

			border-radius: var(--sc-radius, var(--radius-md));

			.root:where([data-initialized]) & {
				display: none;
			}

			@mixin where-light {
				box-shadow: var(--sc-shadow, none);
			}

			@mixin where-dark {
				box-shadow: none;
			}
		}

		fieldset:disabled &,
		&[data-disabled] {
			cursor: not-allowed;

			color: var(--color-disabled-text);
		}
	}

	&:where(:not([data-disabled], [data-active], [data-read-only])) {
		@mixin hover {
			@mixin where-light {
				color: var(--color-black);
			}

			@mixin where-dark {
				color: var(--color-white);
			}
		}
	}

	fieldset:disabled & {
		@mixin hover {
			color: var(--color-disabled-text) !important;
		}
	}
}

.input {
	position: absolute;

	overflow: hidden;

	width: 0;
	height: 0;

	white-space: nowrap;

	opacity: 0;

	&:focus-visible {
		&+.label {
			--segmented-control-outline: 2px solid var(--color-primary-filled);
		}
	}
}

.control {
	position: relative;
	z-index: 2;

	flex: 1;

	transition: border-color var(--sc-transition-duration) var(--sc-transition-timing-function);

	.root[data-with-items-borders] :where(&)::before {
		content: '';

		position: absolute;
		top: 0;
		bottom: 0;
		inset-inline-start: 0;

		width: 1px;

		background-color: var(--separator-color);

		transition: background-color var(--sc-transition-duration) var(--sc-transition-timing-function);
	}

	&[data-orientation='vertical'] {
		&::before {
			top: 0;
			bottom: auto;
			inset-inline: 0;

			width: auto;
			height: 1px;
		}
	}

	&:first-of-type {
		&::before {
			--separator-color: transparent;
		}
	}

	&[data-active] {
		[data-mantine-color-scheme] & {

			&,
			&+.control {
				&::before {
					--separator-color: transparent;
				}
			}
		}
	}

	@mixin where-light {
		--separator-color: var(--color-gray-3);
	}

	@mixin where-dark {
		--separator-color: var(--color-dark-4);
	}
}

.innerLabel {
	position: relative;
	z-index: 2;

	display: inline-flex;
	gap: var(--spacing-2xs);
	align-items: center;
}
</style>
