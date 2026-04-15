<script lang='ts' setup>
import type { AnyString, ComponentFactory, NuanceColor, NuanceGradient, NuanceRadius, NuanceSize, NuanceSpacing } from '@nui/types'
import type { CSSProperties, HTMLAttributes } from 'vue'

import { useVarsResolver } from '@nui/composables'
import { createVariantColorResolver, getFontSize, getRadius, getSize, getSpacing } from '@nui/utils'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import Loader from '../loader/loader.vue'
import css from './button.module.css'


type ButtonClasses = 'root' | 'inner' | 'label' | 'section'

export type ButtonVariant
	= 'filled'
	| 'light'
	| 'outline'
	| 'subtle'
	| 'default'
	| 'gradient'
	| 'gradient-outline'

interface ButtonVars {
	root:
	| '--button-justify'
	| '--button-height'
	| '--button-padding-x'
	| '--button-fz'
	| '--button-radius'
	| '--button-bg'
	| '--button-hover'
	| '--button-color'
	| '--button-bd'
	| '--button-spacing'
	leftSection: '--section-pointer-events'
	rightSection: '--section-pointer-events'
}

interface StyleProps {
	/** Color from theme */
	color?: NuanceColor

	/** Component size */
	size?: NuanceSize | `compact-${NuanceSize}`

	/** Spacing token */
	spacing?: NuanceSpacing | AnyString

	/** Gradient configuration (used with `variant="gradient"`) */
	gradient?: NuanceGradient

	/** Border radius */
	radius?: NuanceRadius | AnyString

	/** Sets `justify-content` of `inner` element @default 'center' */
	justify?: CSSProperties['justify-content']

	/** `pointer-events` value for the left section @default `'none'` */
	leftSectionPE?: CSSProperties['pointer-events']

	/** `pointer-events` value for the right section @default `'all'` */
	rightSectionPE?: CSSProperties['pointer-events']
}

interface Props extends BoxProps, StyleProps {
	/** Loading state */
	loading?: boolean

	/** Icon displayed before the label */
	icon?: string

	/** Extra attributes forwarded to the left section element */
	leftSectionProps?: HTMLAttributes

	/** Extra attributes forwarded to the right section element */
	rightSectionProps?: HTMLAttributes

}

type ButtonFactory = ComponentFactory<{
	props: Props
	classes: ButtonClasses
	variant: ButtonVariant
	vars: ButtonVars
}>

export type ButtonProps = ButtonFactory['props']

const {
	is = 'button',
	variant = 'default',
	leftSectionPE = 'none',
	rightSectionPE = 'all',
	mod,
	icon,
	loading,
	classes,
	rightSectionProps,
	...props
} = defineProps<ButtonProps>()

const style = useVarsResolver<ButtonFactory>(theme => {
	const { background, border, hover, text } = createVariantColorResolver({
		theme,
		variant,
		color: props.color,
		gradient: props.gradient,
	})

	return {
		root: {
			'--button-justify': props.justify,
			'--button-height': getSize(props.size, 'button-height'),
			'--button-padding-x': getSize(props.size, 'button-padding-x'),
			'--button-fz': props.size?.includes('compact')
				? getFontSize(props.size.replace('compact-', ''))
				: getFontSize(props.size),
			'--button-bg': background,
			'--button-hover': hover,
			'--button-color': text,
			'--button-bd': border,
			'--button-radius': getRadius(props.radius),
			'--button-spacing': getSpacing(props.spacing),
		},
		leftSection: {
			'--section-pointer-events': leftSectionPE,
		},
		rightSection: {
			'--section-pointer-events': rightSectionPE,
		},
	}
})
</script>

<template>
	<Box
		:is
		type='button'
		:mod='[mod, {
			"with-left-section": !!$slots?.leftSection || !!icon,
			"with-right-section": !!$slots?.rightSection,
			loading,
			variant,
		}]'
		:style='style.root'
		:class='[css.root, classes?.root]'
		:disabled='loading'
	>
		<Transition name='fade-down'>
			<Loader v-show='loading' :class='css.loader' :color :size />
		</Transition>

		<span :class='[css.inner, classes?.inner]'>
			<span
				v-if='$slots.leftSection || icon'
				:class='[css.section, classes?.section]'
				data-position='left'
				v-bind='leftSectionProps'
				:style='style.leftSection'
			>
				<slot name='leftSection'>
					<Icon v-if='icon' :name='icon' />
				</slot>
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
