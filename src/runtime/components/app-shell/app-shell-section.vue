<script setup lang='ts'>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'


export interface AppShellSectionProps extends BoxProps {
	/**
	 * Stretches the section to fill all available space
	 * @default false
	 */
	grow?: boolean
}

const { is = 'section', mod, grow, ...rest } = defineProps<AppShellSectionProps>()
</script>

<template>
	<Box :is v-bind='rest' :class='$style.root' :mod='[{ grow }, mod]'>
		<slot />
	</Box>
</template>

<style module>
.root {
	flex-grow: 0;

	&:where([data-grow]) {
		flex-grow: 1;
	}
}
</style>
