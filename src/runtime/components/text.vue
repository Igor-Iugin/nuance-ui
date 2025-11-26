<script setup lang='ts'>
import type { UiKitColor, UiKitGradient, UiKitSize } from '@nui/types'
import type { CSSProperties } from 'vue'

import { useStyleResolver } from '@nui/composals'
import { getFontSize, getGradient, getLineHeight, getThemeColor } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from './box.vue'

import Box from './box.vue'


type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6
type TextTruncate = 'end' | 'start' | boolean

export interface TextProps extends /* @vue-ignore */ BoxProps {
	/** Controls `font-size` and `line-height`, `'md'` by default */
	size?: UiKitSize | `h${TitleOrder}` | string

	/** Number of lines after which Text will be truncated */
	lineClamp?: number

	/** Side on which Text must be truncated, if `true`, text is truncated from the start */
	truncate?: TextTruncate

	/** Sets `line-height` to 1 for centering, `false` by default */
	inline?: boolean

	/** Determines whether font properties should be inherited from the parent, `false` by default */
	inherit?: boolean

	/** Gradient configuration, ignored when `variant` is not `gradient`, `theme.defaultGradient` by default */
	gradient?: UiKitGradient

	variant?: 'text' | 'gradient'

	fz?: UiKitSize | `h${TitleOrder}` | string
	lh?: UiKitSize | string
	fw?: CSSProperties['font-weight']
	c?: UiKitColor
}

const {
	is = 'p',
	truncate,
	lineClamp,
	inline,
	inherit,
	mod,
	variant = 'text',
	gradient,
	fz,
	fw,
	lh,
	c,
	size = 'sm',
	...rest
} = defineProps<TextProps>()

const _mod = computed(() => [
	{
		truncate,
		'line-clamp': lineClamp,
		inline,
		inherit,
		variant,
	},
	mod,
])

const style = computed(() => useStyleResolver(theme => ({
	'--text-fz': getFontSize(fz || size),
	'--text-fw': fw,
	'--text-lh': getLineHeight(lh || size),
	'--text-gradient': variant === 'gradient' ? getGradient(gradient, theme) : undefined,
	'--text-line-clamp': lineClamp?.toString(),
	'--text-color': c ? getThemeColor(c, theme) : undefined,
})))
</script>

<template>
	<Box :is v-bind='rest' :mod='_mod' :class='$style.root' :style>
		<slot />
	</Box>
</template>

<style module lang='postcss'>
.root {
	--text-fz: var(--font-size-md);
	--text-lh: var(--line-height-md);
	--text-color: inherit;
	--text-fw: normal;

	margin: 0;
	padding: 0;

	font-size: var(--text-fz);
	font-weight: var(--text-fw);
	line-height: var(--text-lh);
	color: var(--text-color);
	text-decoration: none;
	-webkit-tap-highlight-color: transparent;

	&:where([data-truncate]) {
		overflow: hidden;

		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&:where([data-truncate='start']) {
		direction: rtl;

		text-align: right;

		@mixin where-rtl {
			direction: ltr;

			text-align: left;
		}
	}

	&:where([data-variant='gradient']) {
		background-image: var(--text-gradient);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	&:where([data-line-clamp]) {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: var(--text-line-clamp);

		text-overflow: ellipsis;
	}

	&:where([data-inherit]) {
		font-size: inherit;
		font-weight: inherit;
		line-height: inherit;
	}

	&:where([data-inline]) {
		line-height: 1;
	}
}
</style>
