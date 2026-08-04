<script setup lang='ts'>
import type { AnyString, NuanceRadius, NuanceSize } from '@nui/types'

import { getRadius, getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxMod, StyleProps } from '../box'

import Box from '../box/box.vue'
import css from './progress.module.css'


export interface ProgressRootProps extends StyleProps {
	/** Component size @default `'md'` */
	size?: NuanceSize | AnyString

	/** Border radius @default `theme.defaultRadius` */
	radius?: NuanceRadius | AnyString

	/** Sections width transition duration in ms @default `100` */
	transitionDuration?: number

	/** Orientation @default `'horizontal'` */
	orientation?: 'horizontal' | 'vertical'

	mod?: BoxMod
}

const {
	orientation,
	mod,
	size,
	radius,
	transitionDuration,
	...rest
} = defineProps<ProgressRootProps>()

const style = computed(() => ({
	'--progress-size': getSize(size, 'progress-size'),
	'--progress-radius': radius === undefined ? undefined : getRadius(radius),
	'--progress-transition-duration':
		typeof transitionDuration === 'number' ? `${transitionDuration}ms` : undefined,
}))
</script>

<template>
	<Box
		v-bind='rest'
		:style
		:class='css.root'
		:mod='[{ orientation }, mod]'
	>
		<slot />
	</Box>
</template>
