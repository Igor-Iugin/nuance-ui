<script setup lang='ts'>
import type { AnyString, NuanceColor, NuanceGradient, NuanceRadius, NuanceSize } from '@nui/types'

import { useConfig, useVarsResolver } from '@nui/composables'
import { BUTTON_SIZE_TOKENS, getBaseSize, getFontSize, getRadius, getSize } from '@nui/utils'

import type { BoxProps } from '../box/box.vue'
import type { ButtonVariant } from './button.vue'

import Box from '../box/box.vue'
import css from './button.module.css'


export interface ButtonSectionVars {
	root:
		| '--addon-height'
		| '--addon-padding-x'
		| '--addon-fz'
		| '--addon-radius'
		| '--addon-bg'
		| '--addon-color'
		| '--addon-bd'
}

export interface ButtonSectionProps extends BoxProps {
	/** Component size */
	size?: NuanceSize | `compact-${NuanceSize}` | `input-${NuanceSize}` | AnyString

	/** Gradient configuration (used with `variant="gradient"`) */
	gradient?: NuanceGradient

	/** Color from theme */
	color?: NuanceColor

	/** Border radius */
	radius?: NuanceRadius | AnyString

	/** Visual variant */
	variant?: ButtonVariant
}

const {
	is,
	mod,
	gradient,
	radius,
	size,
	variant = 'default',
	color,
} = defineProps<ButtonSectionProps>()

const { variantResolver } = useConfig()

const style = useVarsResolver<ButtonSectionVars>(theme => {
	const { background, border, text } = variantResolver({
		variant,
		color,
		theme,
		gradient,
	})

	// Addon only defines plain and `input-*` heights, and plain paddings/font sizes
	const baseSize = getBaseSize(size)
	const heightSize = typeof size === 'string' && size.startsWith('input-') ? size : baseSize

	return {
		root: {
			'--addon-height': getSize(heightSize, 'addon-height', BUTTON_SIZE_TOKENS),
			'--addon-padding-x': getSize(baseSize, 'addon-padding-x', BUTTON_SIZE_TOKENS),
			'--addon-fz': getFontSize(baseSize),
			'--addon-radius': radius === undefined ? undefined : getRadius(radius),
			'--addon-bg': background,
			'--addon-color': text,
			'--addon-bd': border,
		},
	}
})
</script>

<template>
	<Box
		:is
		:mod='[{ variant }, mod]'
		:style='style.root'
		:class='css.addon'
	>
		<slot />
	</Box>
</template>
