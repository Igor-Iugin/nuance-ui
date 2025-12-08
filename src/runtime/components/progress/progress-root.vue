<script setup lang='ts'>
import type { BoxProps } from '@nui/components'
import type { NuanceRadius, NuanceSize } from '@nui/types'

import { getRadius, getSize } from '@nui/utils'
import { computed } from 'vue'

import Box from '../box.vue'
import css from './progress.module.css'


export interface ProgressRootProps extends BoxProps {
	/** Controls track height @default `'md'` */
	size?: NuanceSize | string

	/** Key of `theme.radius` or any valid CSS value to set `border-radius` @default `theme.defaultRadius` */
	radius?: NuanceRadius

	/** Controls sections width transition duration, value is specified in ms @default `100` */
	transitionDuration?: number

	/** Controls orientation @default `'horizontal'` */
	orientation?: 'horizontal' | 'vertical'
}

const {
	orientation,
	mod,
	size,
	radius,
	transitionDuration,
} = defineProps<ProgressRootProps>()

const style = computed(() => ({
	'--progress-size': getSize(size, 'progress-size'),
	'--progress-radius': radius === undefined ? undefined : getRadius(radius),
	'--progress-transition-duration':
		typeof transitionDuration === 'number' ? `${transitionDuration}ms` : undefined,
}))
</script>

<template>
	<Box :style :class='css.root' :mod='[{ orientation }, mod]'>
		<slot />
	</Box>
</template>
