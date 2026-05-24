<script lang="ts" setup>
import type { CSSProperties } from 'vue'

import { getSpacing, useVarsResolver } from '#imports'

import type { NuanceSpacing } from '../types'
import type { BoxProps } from './box.vue'

import Box from './box.vue'


interface GroupVars {
	root:
		| '--group-gap'
		| '--group-align'
		| '--group-justify'
		| '--group-wrap'
}

export interface GroupProps extends BoxProps {
	/** Controls `justify-content` CSS property @default 'flex-start' */
	justify?: CSSProperties['justifyContent']

	/** Controls `align-items` CSS property @default 'center' */
	align?: CSSProperties['alignItems']

	/** Controls `flex-wrap` CSS property @default 'wrap' */
	wrap?: CSSProperties['flexWrap']

	/** Key of `theme.spacing` or any valid CSS value for `gap`, numbers are converted to rem @default 'md' */
	gap?: NuanceSpacing

	/** Determines whether each child element should have `flex-grow: 1` style @default false */
	grow?: boolean
}

const {
	grow,
	justify,
	align,
	wrap,
	gap,
	mod,
	...props
} = defineProps<GroupProps>()

const style = useVarsResolver<GroupVars>(() => ({
	root: {
		'--group-gap': getSpacing(gap),
		'--group-align': align ?? undefined,
		'--group-justify': justify ?? undefined,
		'--group-wrap': wrap ?? undefined,
	},
}))
</script>

<template>
	<Box v-bind='props' :style='style.root' :class='$style.root' :mod='[{ grow }, mod]'>
		<slot />
	</Box>
</template>

<style module>
.root {
	display: flex;
	flex-direction: row;
	flex-wrap: var(--group-wrap, wrap);
	gap: var(--group-gap, var(--spacing-md));
	align-items: var(--group-align, center);
	justify-content: var(--group-justify, flex-start);

	&:where([data-grow]) {
		&>* {
			flex-grow: 1;
		}
	}
}
</style>
