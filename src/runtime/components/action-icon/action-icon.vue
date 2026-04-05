<script setup lang='ts'>
import type { Classes, NuanceColor, NuanceGradient, NuanceRadius, NuanceSize } from '@nui/types'

import { useStyleResolver } from '@nui/composables'
import { createVariantColorResolver, getRadius, getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import Loader from '../loader/loader.vue'
import css from './action-icon.module.css'


export interface ActionIconProps {
	/** Component size */
	size?: NuanceSize | `input-${NuanceSize}` | string

	/**
	 * Visual variant
	 * @default 'default'
	 */
	variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient'

	/** Gradient configuration (used with `variant="gradient"`) */
	gradient?: NuanceGradient

	/** Loading state */
	loading?: boolean

	/** Color from theme */
	color?: NuanceColor

	/** Border radius */
	radius?: NuanceRadius

	/** Styles API */
	classes?: Classes<'root' | 'icon'>

	/** Modifiers passed through to the underlying `Box` */
	mod?: BoxProps['mod']

	/** Icon name rendered inside the button when no default slot is provided */
	icon?: string

	/** Disables the component */
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
		type='button'
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
