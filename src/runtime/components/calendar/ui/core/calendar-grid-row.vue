<script setup lang="ts">
import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'


export interface CalendarGridRowProps extends BoxProps {}

const { is = 'tr', ...props } = defineProps<CalendarGridRowProps>()
</script>

<template>
	<Box :is v-bind='props'>
		<slot />
	</Box>
</template>
