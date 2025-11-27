<script setup lang='ts'>
import type { NuanceColor, NuanceRadius, NuanceSize, UiKitGradient } from '@nui/types'

import { useStyleResolver } from '@nui/composals'
import { createVariantColorResolver, getFontSize, getRadius, getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import css from './action-icon.module.css'


export interface ActionIconSectionProps extends /* @vue-ignore */ BoxProps {
	size?: NuanceSize | `compact-${NuanceSize}`
	variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient'
	gradient?: UiKitGradient
	loading?: boolean
	color?: NuanceColor
	radius?: NuanceRadius
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

const style = computed(() => useStyleResolver(theme => {
	const {
		background,
		border,
		text,
	} = createVariantColorResolver({ variant, color, theme, gradient })

	return {
		'--section-height': getSize(size, 'section-height'),
		'--section-padding-x': getSize(size, 'section-padding-x'),
		'--section-fz': getFontSize(size),
		'--section-radius': radius === undefined ? undefined : getRadius(radius),
		'--section-bg': color || variant ? background : undefined,
		'--section-color': text,
		'--section-bd': color || variant ? border : undefined,
	}
}))
</script>

<template>
	<Box :is :mod='[mod, { variant }]' :style :class='css.section'>
		<slot />
	</Box>
</template>
