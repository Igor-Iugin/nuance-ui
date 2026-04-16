<script setup lang='ts'>
import type { AnyString, NuanceColor, NuanceGradient, NuanceRadius } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { createVariantColorResolver, getFontSize, getRadius, getSize } from '@nui/utils'

import type { BoxProps } from '../box.vue'
import type { ActionIconSize, ActionIconVariant } from './action-icon.vue'

import Box from '../box.vue'
import css from './action-icon.module.css'


export interface ActionIconSectionVars {
	root:
		| '--section-height'
		| '--section-padding-x'
		| '--section-fz'
		| '--section-radius'
		| '--section-bg'
		| '--section-color'
		| '--section-bd'
}

export interface ActionIconSectionProps extends BoxProps {
	/** Component size */
	size?: ActionIconSize

	/** Gradient configuration (used with `variant="gradient"`) */
	gradient?: NuanceGradient

	/** Color from theme */
	color?: NuanceColor

	/** Border radius */
	radius?: NuanceRadius | AnyString

	/** Loading state */
	loading?: boolean

	/** Visual variant */
	variant?: ActionIconVariant
}

const {
	is,
	mod,
	gradient,
	radius,
	size,
	variant = 'default',
	color,
} = defineProps<ActionIconSectionProps>()

const style = useVarsResolver<ActionIconSectionVars>(theme => {
	const { background, border, text } = createVariantColorResolver({ variant, color, theme, gradient })

	return {
		root: {
			'--section-height': getSize(size, 'section-height'),
			'--section-padding-x': getSize(size, 'section-padding-x'),
			'--section-fz': getFontSize(size),
			'--section-radius': radius === undefined ? undefined : getRadius(radius),
			'--section-bg': color || variant ? background : undefined,
			'--section-color': text,
			'--section-bd': color || variant ? border : undefined,
		},
	}
})
</script>

<template>
	<Box :is :mod='[mod, { variant }]' :style='style.root' :class='css.section'>
		<slot />
	</Box>
</template>
