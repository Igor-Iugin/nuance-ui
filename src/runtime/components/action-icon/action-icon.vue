<script setup lang='ts'>
import type { NuanceColor, NuanceGradient, NuanceRadius, NuanceSize } from '@nui/types'

import { useStyleResolver } from '@nui/composals'
import { createVariantColorResolver, getRadius, getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import Loader from '../loader/loader.vue'
import css from './action-icon.module.css'


export interface ActionIconProps {
	size?: NuanceSize | `input-${NuanceSize}` | string
	variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient'
	gradient?: NuanceGradient
	loading?: boolean
	color?: NuanceColor
	radius?: NuanceRadius

	/** Styles API */
	classes?: {
		root?: string
		icon?: string
	}
	mod?: BoxProps['mod']
	icon?: string
	disabled?: boolean
}

const {
	color,
	size,
	variant = 'default',
	gradient,
	loading,
	classes,
	radius,
	mod,
	icon,
	disabled,
} = defineProps<ActionIconProps>()

const style = computed(() => useStyleResolver(theme => {
	const {
		background,
		border,
		hover,
		text,
	} = createVariantColorResolver({ variant, color, theme, gradient })

	return {
		'--ai-size': getSize(size, 'ai-size'),
		'--ai-radius': getRadius(radius),
		'--ai-bg': background,
		'--ai-hover': hover,
		'--ai-color': text,
		'--ai-bd': border,
	}
}))
</script>

<template>
	<Box
		is='button'
		:mod='[{ loading }, mod]'
		:style
		:class='[css.root, classes?.root]'
		:disabled='(!disabled ? loading : disabled) || undefined'
	>
		<Transition name='slide-down'>
			<Loader
				v-if='loading'
				color='var(--ai-color)'
				size='calc(var(--ai-size) * .55)'
				:class='css.loader'
			/>
		</Transition>

		<span :class='[css.icon, classes?.icon]'>
			<slot>
				<Icon v-if='icon' :name='icon' :class='css["icon-element"]' />
			</slot>
		</span>
	</Box>
</template>
