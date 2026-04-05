<script lang='ts' setup>
import type { Classes, NuanceColor, NuanceGradient, NuanceRadius, NuanceSize } from '@nui/types'
import type { HTMLAttributes } from 'vue'

import { useStyleResolver } from '@nui/composables'
import { createVariantColorResolver, getFontSize, getRadius, getSize, getSpacing } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import Loader from '../loader/loader.vue'
import css from './button.module.css'


export interface ButtonProps extends BoxProps {
	/** Component size */
	size?: NuanceSize | `compact-${NuanceSize}`

	/** Spacing token */
	spacing?: NuanceSize | string

	/**
	 * Visual variant
	 * @default `'default'`
	 */
	variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default' | 'gradient' | 'gradient-outline'

	/** Gradient configuration (used with `variant="gradient"`) */
	gradient?: NuanceGradient

	/** Loading state */
	loading?: boolean

	/** Color from theme */
	color?: NuanceColor

	/** Border radius */
	radius?: NuanceRadius

	/** Styles API */
	classes?: Classes<'root' | 'inner' | 'label' | 'section'>

	/**
	 * `pointer-events` value for the left section
	 * @default `'none'`
	 */
	leftSectionPE?: CSSStyleDeclaration['pointerEvents']

	/** Extra attributes forwarded to the left section element */
	leftSectionProps?: HTMLAttributes

	/**
	 * `pointer-events` value for the right section
	 * @default `'all'`
	 */
	rightSectionPE?: CSSStyleDeclaration['pointerEvents']

	/** Extra attributes forwarded to the right section element */
	rightSectionProps?: HTMLAttributes
}

const {
	color,
	size,
	variant = 'default',
	spacing,
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
			'--button-spacing': getSpacing(spacing),
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
		type='button'
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
