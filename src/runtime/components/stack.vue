<script lang="ts" setup>
import type { CSSProperties } from 'vue'

import { getSpacing, useVarsResolver } from '#imports'

import type { NuanceSpacing } from '../types'
import type { BoxProps } from './box/box.vue'

import Box from './box/box.vue'


interface StackVars {
	root: '--stack-gap' | '--stack-align' | '--stack-justify'
}

export interface StackProps extends BoxProps {
	/** Key of `theme.spacing` or any valid CSS value to set `gap` property, numbers are converted to rem @default 'md' */
	gap?: NuanceSpacing

	/** Controls `align-items` CSS property @default 'stretch' */
	align?: CSSProperties['alignItems']

	/** Controls `justify-content` CSS property @default 'flex-start' */
	justify?: CSSProperties['justifyContent']
}

const {
	gap,
	align,
	justify,
	...props
} = defineProps<StackProps>()

const style = useVarsResolver<StackVars>(() => ({
	root: {
		'--stack-gap': getSpacing(gap),
		'--stack-align': align ?? undefined,
		'--stack-justify': justify ?? undefined,
	},
}))
</script>

<template>
	<Box v-bind='props' :style='style.root' :class='$style.root'>
		<slot />
	</Box>
</template>

<style module>
.root {
	display: flex;
	flex-direction: column;
	gap: var(--stack-gap, var(--spacing-md));
	align-items: var(--stack-align, stretch);
	justify-content: var(--stack-justify, flex-start);
}
</style>
