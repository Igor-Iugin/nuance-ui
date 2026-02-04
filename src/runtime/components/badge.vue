<script setup lang="ts">
import { useStyleResolver } from '@nui/composals'
import { computed } from 'vue'

import type { NuanceColor, NuanceGradient, NuanceRadius, NuanceSize } from '../types'
import type { BoxProps } from './box.vue'

import { createVariantColorResolver, getRadius, getSize, getThemeColor } from '../utils'
import Box from './box.vue'


export interface BadgeProps extends BoxProps {
	variant?:
		| 'filled'
		| 'light'
		| 'outline'
		| 'dot'
		| 'default'
		| 'gradient'

	/** Controls `font-size`, `height` and horizontal `padding` @default `'md'` */
	size?: NuanceSize | string

	/** If set, badge `min-width` becomes equal to its `height` and horizontal padding is removed */
	circle?: boolean

	/** Key of `theme.radius` or any valid CSS value to set `border-radius` @default `'xl'` */
	radius?: NuanceRadius

	/** Key of `theme.colors` or any valid CSS color @default `theme.primaryColor` */
	color?: NuanceColor | string

	/** Gradient configuration used when `variant=\"gradient\"` @default `theme.defaultGradient` */
	gradient?: NuanceGradient

	/** Determines whether Badge should take 100% of its parent width @default `false` */
	fullWidth?: boolean

	/** Icon displayed before to the label */
	icon?: string
}

const {
	variant = 'filled',
	size = 'md',
	radius = 'sm',
	color,
	fullWidth = false,
	circle,
	icon,
} = defineProps<BadgeProps>()

const style = computed(() => useStyleResolver(theme => {
	const { background, border, text } = createVariantColorResolver({
		theme,
		variant: variant === 'dot' ? 'default' : variant,
		color,
	})

	return {
		'--badge-height': getSize(size, 'badge-height'),
		'--badge-padding-x': getSize(size, 'badge-padding-x'),
		'--badge-fz': getSize(size, 'badge-fz'),
		'--badge-radius': circle || radius === undefined ? undefined : getRadius(radius),
		'--badge-bg': color || variant ? background : undefined,
		'--badge-color': color || variant ? text : undefined,
		'--badge-bd': color || variant ? border : undefined,
		'--badge-dot-color': variant === 'dot' ? getThemeColor(color, theme) : undefined,
	}
}))
</script>

<template>
	<Box
		:style
		:class='$style.root'
		:mod='[
			{
				"block": fullWidth,
				circle,
				variant,
				"with-left-section": !!$slots.leftSection || !!icon,
				"with-right-section": !!$slots.rightSection,
			},
			mod,
		]'
	>
		<span v-if='variant === "dot"' :class='$style.dot' />

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

<style lang="postcss" module>
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
	font-weight: 700;
	line-height: var(--badge-lh);
	color: var(--badge-color);
	text-decoration: none;
	text-overflow: ellipsis;
	text-transform: uppercase;
	letter-spacing: 0.25px;

	background: var(--badge-bg);

	-webkit-tap-highlight-color: transparent;

	&:where([data-with-left-section], [data-variant='dot']) {
		grid-template-columns: auto 1fr;

		padding-left: calc(var(--badge-padding-x) - calc(var(--spacing-xs) / 2));
	}

	&:where([data-with-right-section]) {
		grid-template-columns: 1fr auto;

		padding-right: calc(var(--badge-padding-x) - calc(var(--spacing-xs) / 2));
	}

	&:where([data-with-left-section][data-with-right-section],
		[data-variant='dot'][data-with-right-section]) {
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
	--badge-dot-size: calc(var(--badge-height) / 2);

	display: block;

	width: var(--badge-dot-size);
	height: var(--badge-dot-size);
	margin-inline-end: calc(var(--badge-dot-size) / 2);
	border-radius: var(--badge-dot-size);

	background-color: var(--badge-dot-color, var(--badge-color));

	@mixin where-light {
		border-color: var(--color-gray-4);

		color: var(--color-black);

		background-color: var(--color-white);
	}

	@mixin where-dark {
		border-color: var(--color-dark-5);

		color: var(--color-white);

		background-color: var(--color-dark-5);
	}
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
