<script setup lang='ts'>
import type { AnyString, Classes, NuanceColor, NuanceGradient, NuanceRadius, NuanceSize } from '@nui/types'

import { useConfig, useVarsResolver } from '@nui/composables'
import { getRadius, getSize } from '@nui/utils'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import Loader from '../loader/loader.vue'
import css from './action-icon.module.css'


export type ActionIconClasses = 'root' | 'icon'

export type ActionIconVariant = 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient'

export type ActionIconSize = NuanceSize | `input-${NuanceSize}` | AnyString

export interface ActionIconVars {
	root:
		| '--ai-size'
		| '--ai-icon-size'
		| '--ai-radius'
		| '--ai-bg'
		| '--ai-hover'
		| '--ai-color'
		| '--ai-bd'
}

export interface ActionIconProps {
	/** Component size  @default 'md' */
	size?: ActionIconSize

	/** Icon size — `%` stays relative to the button, other values resolve via size tokens @default '70%' */
	iconSize?: number | string

	/** Gradient configuration (used with `variant="gradient"`) */
	gradient?: NuanceGradient

	/** Color from theme */
	color?: NuanceColor

	/** Border radius */
	radius?: NuanceRadius | AnyString

	/** Loading state */
	loading?: boolean

	/** Icon name rendered inside the button when no default slot is provided */
	icon?: string

	/** Disables the component */
	disabled?: boolean

	/** Element modifiers transformed into `data-` attributes, falsy values are removed */
	mod?: BoxProps['mod']

	/** Visual variant */
	variant?: ActionIconVariant

	/** Active/pressed state — adds `data-active` and the matching ARIA attribute */
	active?: boolean

	/** ARIA semantic for `active` @default 'pressed' */
	activeMode?: 'pressed' | 'current'

	/** Variant applied when `active`. Defaults to the configured map for the current `variant` */
	activeVariant?: ActionIconVariant

	/** Color applied when `active` @default 'primary' */
	activeColor?: NuanceColor

	/** Styles API */
	classes?: Classes<ActionIconClasses>
}

const {
	color = 'gray',
	size,
	iconSize,
	variant = 'default',
	gradient,
	loading,
	classes,
	radius,
	mod,
	icon,
	disabled,
	active,
	activeMode = 'pressed',
	activeVariant,
	activeColor = 'primary',
} = defineProps<ActionIconProps>()

const { variantResolver, activeVariants } = useConfig()
const style = useVarsResolver<ActionIconVars>(theme => {
	const resolvedVariant = active
		? (activeVariant ?? activeVariants[variant] as ActionIconVariant)
		: variant
	const resolvedColor = active ? activeColor : color

	const {
		background,
		border,
		hover,
		text,
	} = variantResolver({ variant: resolvedVariant, color: resolvedColor, theme, gradient })

	return {
		root: {
			'--ai-size': getSize(size, 'ai-size'),
			'--ai-icon-size': getSize(iconSize),
			'--ai-radius': getRadius(radius),
			'--ai-bg': background,
			'--ai-hover': hover,
			'--ai-color': text,
			'--ai-bd': border,
		},
	}
})
</script>

<template>
	<Box
		is='button'
		type='button'
		:mod='[{ loading, active }, mod]'
		:style='style.root'
		:class='[css.root, classes?.root]'
		:disabled='(!disabled ? loading : disabled) || undefined'
		:aria-pressed='activeMode === "pressed" ? active : undefined'
		:aria-current='active && activeMode === "current" ? "page" : undefined'
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
