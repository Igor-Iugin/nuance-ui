<script lang="ts" setup>
import type { BoxProps } from './box.vue'

import Box from './box.vue'


export interface CenterProps extends BoxProps {
	/** If set, `inline-flex` is used instead of `flex` */
	inline?: boolean
}
const {
	inline,
	mod,
	...props
} = defineProps<CenterProps>()
</script>

<template>
	<Box
		v-bind='props'
		:class='$style.root'
		:mod='[{ inline }, mod]'
	>
		<slot />
	</Box>
</template>

<style module>
.root {
	display: flex;
	align-items: center;
	justify-content: center;

	&:where([data-inline]) {
		display: inline-flex;
	}
}
</style>
