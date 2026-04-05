<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'


export interface AppShellSectionProps extends BoxProps {
	/**
	 * Stretches the section to fill all available space
	 * @default false
	 */
	grow?: boolean
}

const { is = 'section', mod, grow } = defineProps<AppShellSectionProps>()
</script>

<template>
	<Box :is :class='$style.root' :mod='[mod, { grow }]'>
		<slot />
	</Box>
</template>

<style module lang='postcss'>
.root {
	flex-grow: 0;

	&:where([data-grow]) {
		flex-grow: 1;
	}
}
</style>
