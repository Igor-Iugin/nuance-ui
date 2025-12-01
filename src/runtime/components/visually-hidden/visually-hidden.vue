<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'


export interface VisuallyHiddenProps extends BoxProps {
	feature?: 'focusable' | 'fully-hidden'
}

const { feature, ...rest } = defineProps<VisuallyHiddenProps>()
</script>

<template>
	<Box
		:aria-hidden='feature === "focusable" ? "true" : undefined'
		:data-hidden='feature === "fully-hidden" ? "true" : undefined'
		:tabindex='feature === "fully-hidden" ? "-1" : undefined'
		v-bind='rest'
		class='root'
	>
		<slot />
	</Box>
</template>

<style scoped>
.root {
	position: absolute;

	overflow: hidden;

	width: 1px;
	height: 1px;
	margin: -1px;
	padding: 0;
	border: 0;

	overflow-wrap: normal;
	white-space: nowrap;

	clip-path: inset(50%);
}
</style>
