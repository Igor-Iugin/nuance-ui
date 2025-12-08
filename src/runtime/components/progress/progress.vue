<script setup lang='ts'>
import type { ProgressRootProps } from './progress-root.vue'
import type { ProgressSectionProps } from './progress-section.vue'

import ProgressRoot from './progress-root.vue'
import ProgressSection from './progress-section.vue'


export interface ProgressProps extends ProgressRootProps, ProgressSectionProps {
}

const {
	mod,
	size,
	color,
	radius,
	striped,
	animated,
	withAria,
	orientation,
	transitionDuration,
} = defineProps<ProgressProps>()

const value = defineModel<number>({ required: true })
</script>

<template>
	<ProgressRoot :size :radius :orientation :transition-duration :mod>
		<ProgressSection
			v-model='value'
			:striped
			:animated
			:color
			:with-aria
		/>
	</ProgressRoot>
</template>
