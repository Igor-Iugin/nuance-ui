<script lang="ts">
import type {
	AnyString,
	Classes,
	NuanceColor,
	NuanceGradient,
	NuanceRadius,
	NuanceSize,
	NuanceSpacing,
	TransformVars,
} from '@nui/types'
import type { NuxtLinkProps } from 'nuxt/app'
import type { CSSProperties, HTMLAttributes } from 'vue'

import type { BoxProps } from '../box/box.vue'


export type ButtonClasses = 'root' | 'inner' | 'label' | 'section' | 'icon'

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
		| '--button-icon-size'
	leftSection: '--section-pointer-events'
	rightSection: '--section-pointer-events'
}

export interface ButtonProps extends BoxProps, Omit<NuxtLinkProps, 'href' | 'custom'> {
	label?: string

	/** Color from theme */
	color?: NuanceColor

	/** Component size @default 'sm' */
	size?: NuanceSize | `compact-${NuanceSize}` | `input-${NuanceSize}` | AnyString

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

	/** Loading state */
	loading?: boolean

	/** Icon displayed before the label */
	icon?: string

	/** Icon displayed before the label */
	trailingIcon?: string

	/** Extra attributes forwarded to the left section element */
	leftSectionProps?: HTMLAttributes

	/** Extra attributes forwarded to the right section element */
	rightSectionProps?: HTMLAttributes

	/** Visual variant */
	variant?: ButtonVariant

	/** Active/pressed state — adds `data-active` and the matching ARIA attribute */
	active?: boolean

	/** ARIA semantic for `active` @default 'pressed' */
	activeMode?: 'pressed' | 'current'

	/** Variant applied when `active`. Defaults to the configured map for the current `variant` */
	activeVariant?: ButtonVariant

	/** Color applied when `active` @default 'primary' */
	activeColor?: NuanceColor

	/** Renders the button as a square — width equals height, horizontal padding removed */
	square?: boolean

	/** Stretches the button to the full width of its container */
	block?: boolean

	/** Icon size — `%` stays relative to the button, other values resolve via size tokens @default '70%' */
	iconSize?: number | string

	/** Disables the component */
	disabled?: boolean

	/** Styles API */
	classes?: Classes<ButtonClasses>

	onClick?: ((event: MouseEvent) => void) | Array<((event: MouseEvent) => void)>
}
</script>

<script lang='ts' setup>
import { useConfig, useTheme, useVarsResolver } from '@nui/composables'
import { BUTTON_SIZE_TOKENS, getBaseSize, getFontSize, getRadius, getSize, getSpacing } from '@nui/utils'
import { createReusableTemplate } from '@vueuse/core'
import { computed } from 'vue'

import { extractStyleProps } from '../box'
import { pickLinkProps } from '../link/lib'
import Loader from '../loader/loader.vue'
import ButtonBase from './button-base.vue'
import css from './button.module.css'


const {
	is,
	variant = 'default',
	leftSectionPE = 'none',
	rightSectionPE = 'all',
	mod,
	icon,
	iconSize,
	trailingIcon,
	loading,
	disabled,
	square,
	block,
	classes,
	rightSectionProps,
	active,
	activeMode = 'pressed',
	activeVariant,
	activeColor = 'primary',
	label,
	onClick,
	...props
} = defineProps<ButtonProps>()

const { variantResolver, activeVariants } = useConfig()

/** `isActive` comes from `NuxtLink` and only counts in `current` mode */
function isActiveState(isActive = false) {
	return activeMode === 'current' ? (active || isActive) : !!active
}

function resolvedVariant(isActive = false): ButtonVariant {
	return isActiveState(isActive)
		? (activeVariant ?? activeVariants[variant] as ButtonVariant)
		: variant
}

const [DefineTemplate, ButtonTemplate] = createReusableTemplate<{
	href?: string | null
	navigate?: (event: MouseEvent) => void
	rel?: string | null
	target?: string | null
	isActive?: boolean
}>()

// ─── LINK ───

const { link, rest } = pickLinkProps(props)
const isLink = computed(() => !!link.to)

const theme = useTheme()

function rootStyle(isActive = false): TransformVars<ButtonVars>['root'] {
	const { background, border, hover, text } = variantResolver({
		theme: theme.value,
		variant: resolvedVariant(isActive),
		color: isActiveState(isActive) ? activeColor : props.color,
		gradient: props.gradient,
	})

	return {
		'--button-justify': props.justify,
		'--button-height': getSize(props.size, 'button-height', BUTTON_SIZE_TOKENS),
		'--button-padding-x': getSize(props.size, 'button-padding-x', BUTTON_SIZE_TOKENS),
		'--button-fz': getFontSize(getBaseSize(props.size)),
		'--button-bg': background,
		'--button-hover': hover,
		'--button-color': text,
		'--button-bd': border,
		'--button-radius': getRadius(props.radius),
		'--button-spacing': getSpacing(props.spacing),
		'--button-icon-size': getSize(iconSize),
	}
}

const sectionStyle = useVarsResolver<Omit<ButtonVars, 'root'>>(() => ({
	leftSection: {
		'--section-pointer-events': leftSectionPE,
	},
	rightSection: {
		'--section-pointer-events': rightSectionPE,
	},
}))
</script>

<template>
	<DefineTemplate v-slot='{ href, navigate, rel, target, isActive }'>
		<ButtonBase
			:is
			:href
			:navigate
			:rel
			:target
			:disabled='disabled || loading'
			v-bind='extractStyleProps(rest).styles'
			:mod='[{
				"with-left-section": !!$slots.leftSection || !!icon,
				"with-right-section": !!$slots.rightSection || !!trailingIcon,
				loading,
				disabled,
				"square": square ?? (!label && !$slots.default),
				block,
				"active": isActiveState(isActive),
				"variant": resolvedVariant(isActive),
			}, mod]'
			:style='rootStyle(isActive)'
			:class='[css.root, classes?.root]'
			:aria-pressed='activeMode === "pressed" ? active : undefined'
			:aria-current='activeMode === "current" && isActiveState(isActive) ? "page" : undefined'
			:on-click='onClick'
		>
			<Transition name='fade-down'>
				<Loader
					v-show='loading'
					:class='css.loader'
					:color='props.color'
					:size='props.size'
				/>
			</Transition>

			<span :class='[css.inner, classes?.inner]'>
				<span
					v-if='$slots.leftSection || icon'
					:class='[css.section, classes?.section]'
					data-position='left'
					v-bind='leftSectionProps'
					:style='sectionStyle.leftSection'
				>
					<slot name='leftSection'>
						<Icon
							v-if='icon'
							:name='icon'
							:class='[css.icon, classes?.icon]'
						/>
					</slot>
				</span>

				<span :class='[css.label, classes?.label]'>
					<slot>
						{{ label }}
					</slot>
				</span>

				<span
					v-if='$slots.rightSection || trailingIcon'
					data-position='right'
					:class='[css.section, classes?.section]'
					v-bind='rightSectionProps'
					:style='sectionStyle.rightSection'
				>
					<slot name='rightSection'>
						<Icon
							v-if='trailingIcon'
							:name='trailingIcon'
							:class='[css.icon, classes?.icon]'
						/>
					</slot>
				</span>
			</span>
		</ButtonBase>
	</DefineTemplate>

	<NuxtLink
		v-if='isLink'
		v-slot='{ href, navigate, isActive, ...linkProps }'
		v-bind='link'
		custom
	>
		<ButtonTemplate
			:href
			:navigate
			:is-active
			:rel='"rel" in linkProps ? linkProps.rel : undefined'
			:target='"target" in linkProps ? linkProps.target : undefined'
		/>
	</NuxtLink>

	<ButtonTemplate v-else />
</template>
