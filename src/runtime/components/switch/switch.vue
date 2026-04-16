<script setup lang='ts'>
import type { NuanceColor, NuanceRadius, NuanceSize } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getRadius, getSize, getThemeColor } from '@nui/utils'
import { computed, useId } from 'vue'

import type { InlineInputProps } from '../input/ui/input-inline.vue'

import Box from '../box.vue'
import InputInline from '../input/ui/input-inline.vue'
import { useSwitchGroupState } from './lib/group.context'


export interface SwitchVars {
	root:
		| '--switch-radius'
		| '--switch-height'
		| '--switch-width'
		| '--switch-thumb-size'
		| '--switch-label-font-size'
		| '--switch-track-label-padding'
		| '--switch-color'
}

export interface SwitchProps extends Omit<InlineInputProps, 'id'> {
	/** Id used to bind input and label, auto-generated if not provided */
	id?: string

	/** Input name */
	name?: string

	/** Value used when inside `SwitchGroup` */
	value?: string

	/** Inner label shown in unchecked state */
	offLabel?: string

	/** Inner label shown in checked state */
	onLabel?: string

	/** Color from theme */
	color?: NuanceColor

	/** Component size */
	size?: NuanceSize

	/** Border radius */
	radius?: NuanceRadius

	/** Icon inside the thumb */
	icon?: string

	/** Displays a colored dot inside the thumb matching the track background */
	withIndicator?: boolean
}

const {
	id,
	radius,
	size: _size,
	color,
	name,
	value,
	error,
	labelPosition,
	onLabel,
	offLabel,
	withIndicator,
	disabled: _disabled,
	description,
	icon,
	label,
	mod,
} = defineProps<SwitchProps>()

const uuid = computed(() => id ?? useId())

const ctx = useSwitchGroupState()
const size = computed(() => _size ?? ctx?.size)

const modelValue = defineModel<boolean>({ default: false })

const checked = computed({
	get: () => {
		if (ctx && value !== undefined)
			return ctx.isSelected(value)

		return modelValue.value
	},
	set: (check: boolean) => {
		if (ctx && value !== undefined)
			return ctx.update(value)

		modelValue.value = check
	},
})

const disabled = computed(() => {
	if (_disabled)
		return true

	if (ctx && value !== undefined)
		return ctx.isDisabled(value)

	return false
})

const style = useVarsResolver<SwitchVars>(theme => ({
	root: {
		'--switch-radius': radius === undefined ? undefined : getRadius(radius),
		'--switch-height': getSize(size.value, 'switch-height'),
		'--switch-width': getSize(size.value, 'switch-width'),
		'--switch-thumb-size': getSize(size.value, 'switch-thumb-size'),
		'--switch-label-font-size': getSize(size.value, 'switch-label-font-size'),
		'--switch-track-label-padding': getSize(size.value, 'switch-track-label-padding'),
		'--switch-color': color ? getThemeColor(color, theme) : undefined,
	},
}))
</script>

<template>
	<InputInline
		:id='uuid'
		:style='style.root'
		:class='$style.root'
		body-element='label'
		label-element='span'
		:label
		:label-position
		:description
		:disabled
		:error
		:size
		:mod
	>
		<input
			:id='uuid'
			v-model='checked'
			:disabled
			:name
			:value
			type='checkbox'
			role='switch'
			:class='$style.input'
		>

		<Box
			is='span'
			aria-hidden='true'
			:mod='{ error, "label-position": labelPosition, "without-labels": !onLabel && !offLabel }'
			:class='$style.track'
		>
			<Box
				is='span'
				:mod='{ "reduce-motion": true, "with-indicator": withIndicator && !icon }'
				:class='$style.thumb'
			>
				<Icon v-if='icon' :name='icon' />
			</Box>
			<span :class='$style.trackLabel'>{{ checked ? onLabel : offLabel }}</span>
		</Box>

		<template v-if='!!$slots.label' #label>
			<slot name='label' />
		</template>
		<template v-if='!!$slots.error' #error>
			<slot name='error' />
		</template>
		<template v-if='!!$slots.description' #description>
			<slot name='description' />
		</template>
	</InputInline>
</template>

<style module>
.root {
	--switch-height-xs: rem(16px);
	--switch-height-sm: rem(20px);
	--switch-height-md: rem(24px);
	--switch-height-lg: rem(30px);
	--switch-height-xl: rem(36px);

	--switch-width-xs: rem(32px);
	--switch-width-sm: rem(38px);
	--switch-width-md: rem(46px);
	--switch-width-lg: rem(56px);
	--switch-width-xl: rem(72px);

	--switch-thumb-size-xs: rem(12px);
	--switch-thumb-size-sm: rem(14px);
	--switch-thumb-size-md: rem(18px);
	--switch-thumb-size-lg: rem(22px);
	--switch-thumb-size-xl: rem(28px);

	--switch-label-font-size-xs: rem(7px);
	--switch-label-font-size-sm: rem(9px);
	--switch-label-font-size-md: rem(10px);
	--switch-label-font-size-lg: rem(12px);
	--switch-label-font-size-xl: rem(16px);

	--switch-track-label-padding-xs: rem(3px);
	--switch-track-label-padding-sm: rem(3px);
	--switch-track-label-padding-md: rem(3.5px);
	--switch-track-label-padding-lg: rem(3.5px);
	--switch-track-label-padding-xl: rem(4px);

	--switch-height: var(--switch-height-sm);
	--switch-width: var(--switch-width-sm);
	--switch-thumb-size: var(--switch-thumb-size-sm);
	--switch-label-font-size: var(--switch-label-font-size-sm);
	--switch-track-label-padding: var(--switch-track-label-padding-sm);
	--switch-radius: 1000px;
	--switch-color: var(--color-primary-filled);
	--switch-disabled-color: var(--color-disabled);

	position: relative;
}

.input {
	position: absolute;

	overflow: hidden;

	width: 100%;
	/* Hide the input visually without removing it from the accessibility tree or obscuring it in the DOM */
	height: 100%;

	margin: 0;
	padding: 0;

	white-space: nowrap;

	opacity: 0;
}

.track {
	cursor: var(--switch-cursor, pointer);
	user-select: none;

	position: relative;
	z-index: 0;

	overflow: hidden;
	display: flex;
	align-items: center;
	order: var(--switch-order, 1);

	min-width: var(--switch-width);
	height: var(--switch-height);
	margin: 0;
	border-radius: var(--switch-radius);

	font-size: var(--switch-label-font-size);
	font-weight: var(--font-weight-medium);
	line-height: 0;
	color: var(--switch-text-color);

	appearance: none;
	background-color: var(--switch-bg);

	transition:
		background-color 150ms ease,
		border-color 150ms ease;
	-webkit-tap-highlight-color: transparent;

	&:where([data-without-labels]) {
		width: var(--switch-width);
	}

	.input:focus-visible+& {
		outline: 2px solid var(--color-primary-filled);
		outline-offset: 2px;
	}

	.input:checked+& {
		--switch-bg: var(--switch-color);
		--switch-text-color: var(--color-white);
	}

	.input:disabled+&,
	.input[data-disabled]+& {
		--switch-bg: var(--switch-disabled-color);
		--switch-cursor: not-allowed;
	}

	&[data-label-position='left'] {
		--switch-order: 2;
	}

	@mixin where-light {
		--switch-bg: var(--color-gray-3);
		--switch-text-color: var(--color-gray-6);
	}

	@mixin where-dark {
		--switch-bg: var(--color-dark-5);
		--switch-text-color: var(--color-dark-1);
	}
}

.thumb {
	position: absolute;
	z-index: 1;
	inset-inline-start: var(--switch-thumb-start, var(--switch-track-label-padding));

	display: flex;

	width: var(--switch-thumb-size);
	height: var(--switch-thumb-size);
	border-radius: var(--switch-radius);

	background-color: var(--switch-thumb-bg, var(--color-white));

	transition: inset-inline-start 150ms ease;

	&:where([data-with-indicator])::before {
		content: '';

		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		width: 40%;
		height: 40%;
		border-radius: var(--switch-radius);

		background-color: var(--switch-bg);
	}

	&>* {
		margin: auto;
	}

	.input:checked+*>& {
		--switch-thumb-start: calc(100% - var(--switch-thumb-size) - var(--switch-track-label-padding));
	}

	.input:disabled+*>&,
	.input[data-disabled]+*>& {
		--switch-thumb-bg: var(--switch-thumb-bg-disabled);
	}

	@mixin where-light {
		--switch-thumb-bg-disabled: var(--color-gray-0);
	}

	@mixin where-dark {
		--switch-thumb-bg-disabled: var(--color-dark-3);
	}
}

.trackLabel {
	display: grid;
	place-content: center;

	min-width: calc(var(--switch-width) - var(--switch-thumb-size));
	height: 100%;
	margin-inline-start: calc(var(--switch-thumb-size) + var(--switch-track-label-padding));
	padding-inline: var(--switch-track-label-padding);

	transition: margin 150ms ease;

	.input:checked+*>& {
		margin-inline-start: 0;
		margin-inline-end: calc(var(--switch-thumb-size) + var(--switch-track-label-padding));
	}
}
</style>
