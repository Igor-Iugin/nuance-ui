<script setup lang='ts'>
import type { NuanceColor, NuanceSize } from '@nui/types'

import { useStyleResolver } from '@nui/composals'
import { getRadius, getSize, getThemeColor, parseThemeColor } from '@nui/utils'
import { computed } from 'vue'

import Box from '../box.vue'
import { useCheckboxCardState } from './lib/card.context'


export interface CheckboxIndicatorProps {
	color?: NuanceColor
	iconColor?: NuanceColor
	variant?: 'filled' | 'outline'
	radius?: NuanceSize
	size?: NuanceSize
	indeterminate?: boolean
}

const {
	size = 'sm',
	radius,
	variant = 'filled',
	color,
	iconColor,
	indeterminate,
} = defineProps<CheckboxIndicatorProps>()

const ctx = useCheckboxCardState()
const modelValue = defineModel<boolean>()

const checked = computed(() => {
	if (ctx?.value)
		return ctx?.value.value

	return modelValue.value
})

const style = computed(() => useStyleResolver(theme => {
	const parsed = parseThemeColor({ color, theme })
	const outlineColor = parsed.isThemeColor && parsed.shade === undefined
		? `var(--color-${parsed.color}-outline)`
		: parsed.color

	return ({
		'--checkbox-size': getSize(size, 'checkbox-size'),
		'--checkbox-radius': radius && getRadius(radius),
		'--checkbox-color': variant === 'outline' ? outlineColor : getThemeColor(color, theme),
		'--checkbox-icon-color': iconColor ? getThemeColor(iconColor, theme) : undefined,
	})
}))
</script>

<template>
	<Box :style :class='$style.indicator' :mod='{ checked }'>
		<slot :indeterminate='indeterminate' :class='$style.icon' :mod='{ checked }'>
			<Icon v-if='!indeterminate' name='gravity-ui:check' :class='$style.icon' :mod='{ checked }' />
			<Icon v-else :class='$style.icon' name='gravity-ui:minus' :mod='{ checked }' />
		</slot>
	</Box>
</template>

<style module lang='postcss'>
.indicator {
	--checkbox-size-xs: rem(16px);
	--checkbox-size-sm: rem(20px);
	--checkbox-size-md: rem(24px);
	--checkbox-size-lg: rem(30px);
	--checkbox-size-xl: rem(36px);

	--checkbox-size: var(--checkbox-size-sm);
	--checkbox-color: var(--color-primary-filled);
	--checkbox-icon-color: var(--color-white);

	--checkbox-radius: var(--radius-default);

	position: relative;

	display: flex;
	align-items: center;
	justify-content: center;

	width: var(--checkbox-size);
	min-width: var(--checkbox-size);
	height: var(--checkbox-size);
	min-height: var(--checkbox-size);

	border: 1px solid transparent;
	border-radius: var(--checkbox-radius);

	transition: border-color 100ms ease,
	background-color 100ms ease;
	-webkit-tap-highlight-color: transparent;

	&[data-indeterminate],
	&[data-checked] {
		border-color: var(--checkbox-color);

		background-color: var(--checkbox-color);

		& > .icon {
			transform: none;

			color: var(--checkbox-icon-color);

			opacity: 1;
		}
	}

	&[data-disabled] {
		cursor: not-allowed;

		border-color: var(--color-disabled-border);

		background-color: var(--color-disabled);

		&[data-checked] > .icon {
			@mixin light {
				color: var(--color-gray-5);
			}

			@mixin dark {
				color: var(--color-dark-3);
			}
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

.indicator[data-variant='outline'] {
	&[data-indeterminate]:not([data-disabled]),
	&[data-checked]:not([data-disabled]) {
		border-color: var(--checkbox-color);

		background-color: transparent;

		& > .icon {
			transform: none;

			color: var(--checkbox-color);

			opacity: 1;
		}
	}
}

.icon {
	pointer-events: none;

	transform: translateY(.25rem) scale(0.5);

	display: block;

	width: 80%;

	color: transparent;

	opacity: 1;

	transition: transform 100ms ease,
	opacity 100ms ease;
}
</style>
