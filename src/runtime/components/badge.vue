<script setup lang="ts">
import type { AnyString, NuanceColor, NuanceGradient, NuanceRadius, NuanceSize } from '@nui/types'
import type { CSSProperties } from 'vue'

import { useConfig, useVarsResolver } from '@nui/composables'
import { getRadius, getSize, getThemeColor } from '@nui/utils'

import type { BoxProps } from './box.vue'

import Box from './box.vue'


export type BadgeVariant = 'filled' | 'light' | 'outline' | 'default' | 'gradient' | 'subtle'

export interface BadgeVars {
	root:
		| '--badge-height'
		| '--badge-padding-x'
		| '--badge-fz'
		| '--badge-fw'
		| '--badge-radius'
		| '--badge-bg'
		| '--badge-color'
		| '--badge-bd'
		| '--badge-dot-color'
}

export interface BadgeProps extends BoxProps {
	/**
	 * Component size
	 * @default `'md'`
	 */
	size?: NuanceSize | AnyString

	/** Makes the badge width equal to its height and removes horizontal padding */
	circle?: boolean

	/**
	 * Border radius
	 * @default `'sm'`
	 */
	radius?: NuanceRadius

	/** Color from theme */
	color?: NuanceColor | AnyString

	/** Gradient configuration (used with `variant="gradient"`) */
	gradient?: NuanceGradient

	/**
	 * Stretches the badge to fill its parent width
	 * @default `false`
	 */
	fullWidth?: boolean

	/** Icon displayed before the label */
	icon?: string

	/** Visual variant */
	variant?: BadgeVariant

	/** Font weight */
	fw?: CSSProperties['font-weight']

	/** Adds a dot indicator before the label, inheriting the text color */
	dotted?: boolean
}

const {
	variant = 'filled',
	size = 'md',
	radius = 'sm',
	color,
	fullWidth = false,
	circle,
	icon,
	fw,
	dotted,
} = defineProps<BadgeProps>()

const { variantResolver } = useConfig()
const style = useVarsResolver<BadgeVars>(theme => {
	const { background, border, text } = variantResolver({
		theme,
		variant,
		color,
	})

	return {
		root: {
			'--badge-height': getSize(size, 'badge-height'),
			'--badge-padding-x': getSize(size, 'badge-padding-x'),
			'--badge-fz': getSize(size, 'badge-fz'),
			'--badge-fw': fw,
			'--badge-radius': circle || radius === undefined ? undefined : getRadius(radius),
			'--badge-bg': color || variant ? background : undefined,
			'--badge-color': color || variant ? text : undefined,
			'--badge-bd': color || variant ? border : undefined,
			'--badge-dot-color': dotted
				? variant === 'default'
					? getThemeColor(color, theme)
					: text
				: undefined,
		},
	}
})
</script>

<template>
	<Box
		:style='style.root'
		:class='$style.root'
		:mod='[
			{
				"block": fullWidth,
				circle,
				dotted,
				"with-left-section": !!$slots.leftSection || !!icon,
				"with-right-section": !!$slots.rightSection,
			},
			mod,
		]'
	>
		<span v-if='dotted && !circle' :class='$style.dot' />

		<span v-else-if='$slots.leftSection || !!icon' :class='$style.section' data-position='left'>
			<slot name='leftSection'>
				<Icon v-if='!!icon' :name='icon' />
			</slot>
		</span>

		<span :class='$style.label'>
			<slot />
		</span>

		<span v-if='$slots.rightSection' :class='$style.section' data-position='right'>
			<slot name='rightSection' />
		</span>
	</Box>
</template>

<style module>
.root {
	--badge-height-xs: rem(16px);
	--badge-height-sm: rem(18px);
	--badge-height-md: rem(20px);
	--badge-height-lg: rem(26px);
	--badge-height-xl: rem(32px);

	--badge-fz-xs: rem(8px);
	--badge-fz-sm: rem(10px);
	--badge-fz-md: rem(12px);
	--badge-fz-lg: rem(14px);
	--badge-fz-xl: rem(16px);
	--badge-fw: 600;

	--badge-padding-x-xs: rem(6px);
	--badge-padding-x-sm: rem(8px);
	--badge-padding-x-md: rem(10px);
	--badge-padding-x-lg: rem(12px);
	--badge-padding-x-xl: rem(16px);

	--badge-height: var(--badge-height-md);
	--badge-fz: var(--badge-fz-md);
	--badge-padding-x: var(--badge-padding-x-md);
	--badge-radius: 100%;
	--badge-lh: calc(var(--badge-height) - rem(2px));
	--badge-color: var(--color-white);
	--badge-bg: var(--color-primary-filled);
	--badge-border-width: 1px;
	--badge-bd: var(--badge-border-width) solid transparent;

	cursor: default;

	overflow: hidden;
	display: inline-grid;
	align-items: center;
	justify-content: center;

	width: fit-content;
	height: var(--badge-height);
	padding: 0 var(--badge-padding-x);
	border: var(--badge-bd);
	border-radius: var(--badge-radius);

	font-size: var(--badge-fz);
	font-weight: var(--badge-fw);
	line-height: var(--badge-lh);
	color: var(--badge-color);
	text-decoration: none;
	text-overflow: ellipsis;
	text-transform: uppercase;
	letter-spacing: 0.25px;

	background: var(--badge-bg);

	-webkit-tap-highlight-color: transparent;

	&:where([data-with-left-section], [data-dotted]) {
		grid-template-columns: auto 1fr;

		padding-left: calc(var(--badge-padding-x) - calc(var(--spacing-xs) / 2));
	}

	&:where([data-with-right-section]) {
		grid-template-columns: 1fr auto;

		padding-right: calc(var(--badge-padding-x) - calc(var(--spacing-xs) / 2));
	}

	&:where([data-with-left-section][data-with-right-section],
		[data-dotted][data-with-right-section]) {
		grid-template-columns: auto 1fr auto;

		padding: 0 calc(var(--spacing-xs) / 2);
	}

	&:where([data-block]) {
		display: flex;

		width: 100%;
	}

	&:where([data-circle]) {
		display: flex;

		width: var(--badge-height);
		padding-inline: 2px;
	}
}

.dot {
	--badge-dot-size: calc(var(--badge-height) / 2.5);

	display: block;

	width: var(--badge-dot-size);
	height: var(--badge-dot-size);
	margin-inline-end: calc(var(--badge-dot-size) / 2);
	border-radius: var(--badge-dot-size);

	background-color: var(--badge-dot-color, var(--badge-color));
}


.label {
	cursor: inherit;

	overflow: hidden;

	text-align: center;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.section {
	--badge-section-margin: calc(var(--spacing-xs) / 2);

	display: inline-flex;
	align-items: center;
	justify-content: center;

	max-height: calc(var(--badge-height) - var(--badge-border-width) * 2);

	&:where([data-position='left']) {
		margin-inline-end: var(--badge-section-margin);
	}

	&:where([data-position='right']) {
		margin-inline-start: var(--badge-section-margin);
	}
}
</style>
