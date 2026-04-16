<script setup lang='ts'>
import type { AnyString, ComponentFactory, NuanceColor, NuanceGradient, NuanceSize } from '@nui/types'
import type { CSSProperties } from 'vue'

import { useVarsResolver } from '@nui/composables'
import { getFontSize, getGradient, getLineHeight, getThemeColor } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from './box.vue'

import Box from './box.vue'


type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6
type TextTruncate = 'end' | 'start' | boolean

export type TextVariant = 'text' | 'gradient'

interface TextVars {
	root:
		| '--text-fz'
		| '--text-fw'
		| '--text-lh'
		| '--text-gradient'
		| '--text-line-clamp'
		| '--text-color'
}

type TextFactory = ComponentFactory<{
	props: BoxProps & {
		/** Controls `font-size` and `line-height` */
		size?: NuanceSize | `h${TitleOrder}` | AnyString

		/** Number of lines after which Text will be truncated */
		lineClamp?: number

		/** Side on which Text must be truncated, if `true`, text is truncated from the start */
		truncate?: TextTruncate

		/** Sets `line-height` to 1 for centering */
		inline?: boolean

		/** Determines whether font properties should be inherited from the parent */
		inherit?: boolean

		/** Gradient configuration (used with `variant="gradient"`) */
		gradient?: NuanceGradient

		/** Font size token */
		fz?: NuanceSize | `h${TitleOrder}` | AnyString

		/** Line height token */
		lh?: NuanceSize | AnyString

		/** Font weight */
		fw?: CSSProperties['font-weight']

		/** Text color from theme */
		c?: NuanceColor | 'dimmed'
	}
	classes: never
	variant: TextVariant
	vars: TextVars
}>

export type TextProps = TextFactory['props']

const {
	is = 'p',
	truncate,
	lineClamp,
	inline,
	inherit,
	mod,
	variant,
	gradient,
	fz,
	fw,
	lh,
	c,
	size,
	...rest
} = defineProps<TextProps>()

const _mod = computed(() => [{
	truncate,
	'line-clamp': lineClamp,
	inline,
	inherit,
	variant,
}, mod])

const style = useVarsResolver<TextFactory>(theme => ({
	root: {
		'--text-fz': getFontSize(fz || size),
		'--text-fw': fw?.toString(),
		'--text-lh': getLineHeight(lh || size),
		'--text-gradient': variant === 'gradient' ? getGradient(gradient, theme) : undefined,
		'--text-line-clamp': lineClamp?.toString(),
		'--text-color': c ? getThemeColor(c, theme) : undefined,
	},
}))
</script>

<template>
	<Box :is v-bind='rest' :mod='_mod' :class='$style.root' :style='style.root'>
		<slot />
	</Box>
</template>

<style module>
.root {
	--text-fz: var(--font-size-sm);
	--text-lh: var(--line-height-sm);
	--text-color: inherit;
	--text-fw: normal;
	--text-gradient: none;
	--text-line-clamp: none;

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
		color: inherit;
	}

	&:where([data-inline]) {
		line-height: 1;
	}
}
</style>
