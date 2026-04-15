<script setup lang='ts'>
import type { ComponentFactory, NuanceColor, NuanceSize } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getRadius, getSize, getThemeColor, parseThemeColor } from '@nui/utils'
import { computed, useId } from 'vue'

import type { InlineInputProps } from '../input'

import Box from '../box.vue'
import InputInline from '../input/ui/input-inline.vue'
import { useCheckboxGroupState } from './lib/group.context'


export type CheckboxVariant = 'filled' | 'outline'

interface CheckboxVars {
	root:
	| '--checkbox-size'
	| '--checkbox-radius'
	| '--checkbox-color'
	| '--checkbox-icon-color'
}

type CheckboxFactory = ComponentFactory<{
	props: Omit<InlineInputProps, 'id'> & {
		/** Id used to bind input and label, auto-generated if not provided */
		id?: string

		/** Color from theme */
		color?: NuanceColor

		/** Icon color */
		iconColor?: NuanceColor

		/** Border radius */
		radius?: NuanceSize

		/**
		 * Component size
		 * @default `'sm'`
		 */
		size?: NuanceSize

		/** Value used in checkbox group context */
		value?: string
	}
	classes: never
	variant: CheckboxVariant
	vars: CheckboxVars
}>

export type CheckboxProps = CheckboxFactory['props']

const {
	id,
	size: _size = 'sm',
	radius,
	variant = 'filled',
	color,
	iconColor,
	value,
	disabled: _disabled,
	...rest
} = defineProps<CheckboxProps>()

const modelValue = defineModel<boolean | 'indeterminate'>({ default: false })
const ctx = useCheckboxGroupState()

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

const uuid = computed(() => id ?? useId())
const size = computed(() => _size ?? ctx?.size)

const style = useVarsResolver<CheckboxFactory>(theme => {
	const parsed = parseThemeColor({ color, theme })
	const outlineColor = parsed.isThemeColor && parsed.shade === undefined
		? `var(--color-${parsed.color}-outline)`
		: parsed.color

	return {
		root: {
			'--checkbox-size': getSize(size, 'checkbox-size'),
			'--checkbox-radius': radius === undefined ? undefined : getRadius(radius),
			'--checkbox-color': variant === 'outline' ? outlineColor : getThemeColor(color, theme),
			'--checkbox-icon-color': iconColor ? getThemeColor(iconColor, theme) : undefined,
		},
	}
})
</script>

<template>
	<InputInline
		v-bind='rest'
		:id='uuid'
		:class='$style.root'
		:style='style.root'
		:size
	>
		<Box :class='$style.inner' :mod='{ "label-position": rest?.labelPosition }'>
			<input
				:id
				v-model='checked'
				type='checkbox'
				:class='$style.input'
				:disabled
			>

			<slot name='icon' :indeterminate='modelValue === "indeterminate"' :class='$style.icon'>
				<Icon v-if='modelValue !== "indeterminate"' name='gravity-ui:check' :class='$style.icon' />
				<Icon v-else name='gravity-ui:minus' :class='$style.icon' />
			</slot>
		</Box>
	</InputInline>
</template>

<style module>
.root {
	--checkbox-size-xs: rem(16px);
	--checkbox-size-sm: rem(20px);
	--checkbox-size-md: rem(24px);
	--checkbox-size-lg: rem(30px);
	--checkbox-size-xl: rem(36px);

	--checkbox-size: var(--checkbox-size-sm);
	--checkbox-color: var(--color-primary-filled);
	--checkbox-icon-color: var(--color-white);
}

.inner {
	position: relative;

	order: 1;

	width: var(--checkbox-size);
	height: var(--checkbox-size);

	&:where([data-label-position='right']) {
		order: 2;
	}
}

.input {
	cursor: pointer;

	display: block;

	width: var(--checkbox-size);
	height: var(--checkbox-size);
	margin: 0;
	padding: 0;
	border: 1px solid transparent;
	border-radius: var(--checkbox-radius, var(--radius-default));

	appearance: none;

	transition: border-color 100ms ease,
		background-color 100ms ease;
	-webkit-tap-highlight-color: transparent;

	&:where([data-error]) {
		border-color: var(--color-error);
	}

	&[data-indeterminate],
	&:checked {
		border-color: var(--checkbox-color);

		background-color: var(--checkbox-color);

		&+.icon {
			transform: none;

			opacity: 1;
		}
	}

	&:disabled {
		cursor: not-allowed;

		border-color: var(--color-disabled-border);

		background-color: var(--color-disabled);

		&+.icon {
			color: var(--color-disabled);
		}
	}

	@mixin where-light {
		border-color: var(--color-gray-4);

		background-color: var(--color-white);
	}

	@mixin where-dark {
		border-color: var(--color-dark-4);

		background-color: var(--color-dark-6);
	}
}

.input[data-variant='outline'] {
	&+.icon {
		color: var(--checkbox-color);
	}

	&[data-indeterminate]:not(:disabled),
	&:checked:not(:disabled) {
		border-color: var(--checkbox-color);

		background-color: transparent;

		&+.icon {
			transform: none;

			color: var(--checkbox-color);

			opacity: 1;
		}
	}
}

.icon {
	pointer-events: none;

	position: absolute;
	inset: 0;
	transform: translateY(.25rem) scale(0.5);

	width: 80%;
	margin: auto;

	color: var(--checkbox-icon-color);

	opacity: 0;

	transition: transform 100ms ease,
		opacity 100ms ease;
}
</style>
