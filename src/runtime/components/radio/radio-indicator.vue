<script setup lang='ts'>
import type { Classes, NuanceColor, NuanceSize } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getSize, getThemeColor, parseThemeColor } from '@nui/utils'
import { computed } from 'vue'

import Box from '../box/box.vue'
import { useRadioCardState } from './lib/context'


export interface RadioVars {
	root: '--radio-size' | '--radio-color' | '--radio-icon-color'
}
export type RadioVariant = 'filled' | 'outline'

export interface RadioIndicatorProps {
	checked?: boolean
	disabled?: boolean
	size?: NuanceSize
	color?: NuanceColor
	iconColor?: NuanceColor
	variant?: RadioVariant
	classes?: Classes<'root' | 'icon'>
}

const props = withDefaults(defineProps<RadioIndicatorProps>(), {
	checked: undefined,
})
const card = useRadioCardState()
const checked = computed(() => props.checked ?? card?.checked.value ?? false)
const disabled = computed(() => props.disabled || card?.disabled.value || false)
const style = useVarsResolver<RadioVars>(theme => {
	const parsed = parseThemeColor({ color: props.color, theme })
	return {
		root: {
			'--radio-size': getSize(props.size ?? card?.size.value ?? 'sm', 'radio-size'),
			'--radio-color': props.variant === 'outline'
				&& parsed.isThemeColor && parsed.shade === undefined
				? `var(--color-${parsed.color}-outline)`
				: getThemeColor(props.color, theme),
			'--radio-icon-color': props.iconColor
				? getThemeColor(props.iconColor, theme)
				: undefined,
		},
	}
})
</script>

<template>
	<Box
		is='span'
		aria-hidden='true'
		:style='style.root'
		:class='[$style.root, props.classes?.root]'
		:mod='{ checked, disabled, variant: props.variant ?? "filled" }'
	>
		<span :class='[$style.icon, props.classes?.icon]'>
			<slot :checked :disabled>
				<span :class='$style.dot' />
			</slot>
		</span>
	</Box>
</template>

<style module>
.root {
	--radio-size-xs: rem(16px);
	--radio-size-sm: rem(20px);
	--radio-size-md: rem(24px);
	--radio-size-lg: rem(30px);
	--radio-size-xl: rem(36px);
	--radio-icon-color: var(--color-white);

	position: relative;

	display: inline-flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;

	box-sizing: border-box;
	inline-size: var(--radio-size);
	block-size: var(--radio-size);
	border: 1px solid var(--color-gray-4);
	border-radius: 50%;

	background: var(--color-white);

	@mixin where-dark {
		border-color: var(--color-dark-4);

		background: var(--color-dark-6);
	}

	&[data-checked] {
		border-color: var(--radio-color);

		background: var(--radio-color);
	}

	&[data-error] {
		border-color: var(--color-error);
	}

	&[data-variant='outline'] {
		--radio-icon-color: var(--radio-color);

		background: transparent;
	}

	&[data-disabled] {
		--radio-icon-color: var(--color-dimmed);

		border-color: var(--color-disabled-border);

		background: var(--color-disabled);
	}
}

.icon {
	display: flex;
	align-items: center;
	justify-content: center;

	inline-size: 60%;
	block-size: 60%;

	color: var(--radio-icon-color);

	opacity: 0;

	[data-checked]>& {
		opacity: 1;
	}
}

.dot {
	inline-size: 100%;
	block-size: 100%;
	border-radius: 50%;

	background: currentColor;
}

@media (forced-colors: active) {
	.root {
		--radio-icon-color: CanvasText;

		border-color: CanvasText;

		background: Canvas;
	}

	.dot {
		forced-color-adjust: none;
		background: CanvasText;
	}
}
</style>
