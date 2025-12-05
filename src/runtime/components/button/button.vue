<script lang='ts' setup>
import type { NuanceColor, NuanceRadius, NuanceSize, UiKitGradient } from '@nui/types'
import type { HTMLAttributes } from 'vue'

import { useStyleResolver } from '@nui/composals'
import { createVariantColorResolver, getFontSize, getRadius, getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import Loader from '../loader/loader.vue'
import css from './button.module.css'


export interface ButtonProps extends BoxProps {
	size?: NuanceSize | `compact-${NuanceSize}`
	variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient' | 'gradient-outline'
	gradient?: UiKitGradient
	loading?: boolean
	color?: NuanceColor
	radius?: NuanceRadius
	classes?: {
		root?: string
		inner?: string
		label?: string
		section?: string
	}
	/** section pointer-events */
	leftSectionPE?: CSSStyleDeclaration['pointerEvents']
	leftSectionProps?: HTMLAttributes
	/** section pointer-events */
	rightSectionPE?: CSSStyleDeclaration['pointerEvents']
	rightSectionProps?: HTMLAttributes
}

const {
	color,
	size = 'sm',
	variant = 'default',
	gradient,
	loading,
	classes,
	leftSectionPE = 'none',
	leftSectionProps,
	rightSectionPE = 'all',
	rightSectionProps,
	is = 'button',
	radius,
	mod: _mod,
} = defineProps<ButtonProps>()

const mod = computed(() => [{ loading, variant }, _mod])
const style = computed(() => useStyleResolver(theme => {
	const {
		background,
		border,
		hover,
		text,
	} = createVariantColorResolver({ variant, color, theme, gradient })

	return {
		root: {
			'--button-height': getSize(size, 'button-height'),
			'--button-padding-x': getSize(size, 'button-padding-x'),
			'--button-fz': size?.includes('compact')
				? getFontSize(size.replace('compact-', ''))
				: getFontSize(size),
			'--button-bg': background,
			'--button-hover': hover,
			'--button-color': text,
			'--button-bd': border,
			'--button-radius': getRadius(radius),
		},
		leftSection: {
			'--section-pointer-events': leftSectionPE,
		},
		rightSection: {
			'--section-pointer-events': rightSectionPE,
		},
	}
}))
</script>

<template>
	<Box
		:is
		:mod='[
			{
				"with-left-section": !!$slots?.leftSection,
				"with-right-section": !!$slots?.rightSection,
			},
			mod,
		]'
		:style='style.root'
		:class='[css.root, classes?.root]'
		:disabled='loading'
	>
		<Transition name='fade-down'>
			<Loader v-show='loading' :class='css.loader' :color :size />
		</Transition>

		<span :class='[css.inner, classes?.inner]'>
			<span
				v-if='$slots.leftSection'
				:class='[css.section, classes?.section]'
				data-position='left'
				v-bind='leftSectionProps'
				:style='style.leftSection'
			>
				<slot name='leftSection' />
			</span>

			<span :class='[css.label, classes?.label]'>
				<slot />
			</span>

			<span
				v-if='$slots.rightSection'
				data-position='right'
				:class='[css.section, classes?.section]'
				v-bind='rightSectionProps'
				:style='style.rightSection'
			>
				<slot name='rightSection' />
			</span>
		</span>
	</Box>
</template>
