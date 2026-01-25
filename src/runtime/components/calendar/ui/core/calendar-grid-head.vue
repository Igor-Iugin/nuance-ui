<script setup lang="ts">
import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'


export interface CalendarGridHeadProps extends BoxProps {}

const { is = 'thead', ...props } = defineProps<CalendarGridHeadProps>()
</script>

<template>
	<Box :is v-bind='props'>
		<slot />
	</Box>
</template>
