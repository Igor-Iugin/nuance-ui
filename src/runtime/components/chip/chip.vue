<script setup lang='ts'>
import type { NuanceColor, NuanceRadius, NuanceSize } from '@nui/types'

import { useStyleResolver } from '@nui/composals'
import { createVariantColorResolver, getFontSize, getRadius, getSize } from '@nui/utils'
import { computed, useId } from 'vue'

import Box from '../box.vue'
import { useChipGroupState, useChipState } from './lib'


export interface ChipProps {
	radius?: NuanceRadius
	size?: NuanceSize
	type?: 'radio' | 'checkbox'
	color?: NuanceColor
	id?: string
	variant?: 'filled' | 'outline' | 'light'
	value?: string
	icon?: string
	hideIcon?: boolean
	disabled?: boolean
}

const {
	id: uid,
	color,
	size = 'sm',
	radius = 'xl',
	variant = 'filled',
	type: _type = 'checkbox',
	value,
	icon = 'gravity-ui:check',
	hideIcon = true,
	disabled: _disabled,
} = defineProps<ChipProps>()

const id = uid || useId()

const modelValue = defineModel<boolean>({ default: false })

const ctx = useChipGroupState()
const { checked, onUpdate } = useChipState(ctx, modelValue, value)

const disabled = ctx?.disabled || _disabled
const type = ctx ? ctx.multiple ? 'checkbox' : 'radio' : _type

const style = computed(() => useStyleResolver(theme => {
	const colors = createVariantColorResolver({
		color,
		theme,
		variant,
	})

	return {
		'--chip-fz': getFontSize(size),
		'--chip-size': getSize(size, 'chip-size'),
		'--chip-radius': radius === undefined ? undefined : getRadius(radius),
		'--chip-checked-padding': getSize(size, 'chip-checked-padding'),
		'--chip-padding': getSize(size, 'chip-padding'),
		'--chip-icon-size': getSize(size, 'chip-icon-size'),
		'--chip-bg': color || variant ? colors.background : undefined,
		'--chip-hover': color || variant ? colors.hover : undefined,
		'--chip-color': color || variant ? colors.text : undefined,
		'--chip-bd': color || variant ? colors.border : undefined,
		'--chip-spacing': getSize(size, 'chip-spacing'),
	}
}))
</script>

<template>
	<Box :style :class='[$style.root, $attrs?.style]'>
		<input
			v-bind='{
				...$attrs,
				class: $style.input,
				checked,
				value,
				type,
				disabled,
				id,
			}'
			@click='onUpdate()'
		>
		<Box is='label' :for='id' :class='$style.label' :mod='{ variant }'>
			<span v-if='hideIcon && checked' :class='$style.iconWrapper'>
				<Icon :name='icon' :class='$style.icon' />
			</span>

			<span><slot /></span>
		</Box>
	</Box>
</template>

<style lang='postcss' module>
.root {
	--chip-size-xs: rem(23px);
	--chip-size-sm: rem(28px);
	--chip-size-md: rem(32px);
	--chip-size-lg: rem(36px);
	--chip-size-xl: rem(40px);

	--chip-icon-size-xs: rem(12px);
	--chip-icon-size-sm: rem(14px);
	--chip-icon-size-md: rem(16px);
	--chip-icon-size-lg: rem(18px);
	--chip-icon-size-xl: rem(20px);

	--chip-padding-xs: rem(16px);
	--chip-padding-sm: rem(20px);
	--chip-padding-md: rem(24px);
	--chip-padding-lg: rem(28px);
	--chip-padding-xl: rem(32px);

	--chip-checked-padding-xs: rem(7.5px);
	--chip-checked-padding-sm: rem(10px);
	--chip-checked-padding-md: rem(11.7px);
	--chip-checked-padding-lg: rem(13.5px);
	--chip-checked-padding-xl: rem(15.7px);

	--chip-spacing-xs: rem(10px);
	--chip-spacing-sm: rem(12px);
	--chip-spacing-md: rem(16px);
	--chip-spacing-lg: rem(20px);
	--chip-spacing-xl: rem(22px);

	--chip-size: var(--chip-size-sm);
	--chip-icon-size: var(--chip-icon-size-sm);
	--chip-padding: var(--chip-padding-sm);
	--chip-spacing: var(--chip-spacing-sm);
	--chip-checked-padding: var(--chip-checked-padding-sm);
	--chip-bg: var(--color-primary-filled);
	--chip-hover: var(--color-primary-filled-hover);
	--chip-color: var(--color-white);
	--chip-bd: 1px solid transparent;

	--chip-fz: var(--font-size-sm);
	--chip-radius: var(--radius-xl);
}

.label {
	cursor: pointer;
	user-select: none;

	display: inline-flex;
	align-items: center;

	height: var(--chip-size);
	padding-inline: var(--chip-padding);

	border: 1px solid transparent;
	border-radius: var(--chip-radius);

	font-size: var(--chip-fz);
	line-height: calc(var(--chip-size) - rem(2px));
	color: var(--color-text);
	white-space: nowrap;
	-webkit-tap-highlight-color: transparent;
}

.iconWrapper {
	overflow: hidden;
	display: flex;
	align-items: center;

	width: calc(var(--chip-icon-size) + (var(--chip-spacing) / 1.5));
	max-width: calc(var(--chip-icon-size) + (var(--chip-spacing) / 1.5));
	height: var(--chip-icon-size);
}

.icon {
	display: block;

	width: var(--chip-icon-size);
	height: var(--chip-icon-size);

	color: var(--chip-icon-color, inherit);
}

.input {
	width: 0;
	height: 0;
	margin: 0;
	padding: 0;

	opacity: 0;

	&:focus-visible + .label {
		outline: 2px solid var(--color-primary-filled);
		outline-offset: 2px;
	}
}

.input:disabled {
	& + .label {
		cursor: not-allowed;

		color: var(--color-disabled-text);

		background-color: var(--color-disabled);
	}
}

.input:not(:disabled) {
	& + .label[data-variant='outline'] {
		@mixin where-light {
			border: 1px solid var(--color-gray-3);

			background-color: var(--color-white);
		}

		@mixin where-dark {
			border: 1px solid var(--color-dark-4);

			background-color: var(--color-dark-6);
		}

		@mixin hover {
			@mixin where-light {
				background-color: var(--color-gray-0);
			}

			@mixin where-dark {
				background-color: var(--color-dark-5);
			}
		}
	}

	& + .label[data-variant='filled'],
	& + .label[data-variant='light'] {
		border: 1px solid transparent;

		color: var(--color-text);

		@mixin where-light {
			background-color: var(--color-gray-1);
		}

		@mixin where-dark {
			background-color: var(--color-dark-5);
		}

		@mixin hover {
			@mixin where-light {
				background-color: var(--color-gray-2);
			}

			@mixin where-dark {
				background-color: var(--color-dark-4);
			}
		}
	}
}

.input:not(:disabled):checked {
	& + .label {
		padding: var(--chip-checked-padding);
	}

	& + .label[data-variant='outline'] {
		--chip-icon-color: var(--chip-color);

		border: var(--chip-bd);

		@mixin hover {
			background-color: var(--chip-hover);
		}
	}

	& + .label[data-variant='filled'],
	& + .label[data-variant='light'] {
		--chip-icon-color: var(--chip-color);

		color: var(--chip-color);

		background-color: var(--chip-bg);

		@mixin hover {
			background-color: var(--chip-hover);
		}
	}
}
</style>
