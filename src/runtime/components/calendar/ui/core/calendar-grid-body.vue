<script setup lang="ts">
import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'


export interface CalendarGridBodyProps extends BoxProps {}

const { is = 'tbody', ...props } = defineProps<CalendarGridBodyProps>()
</script>

<template>
	<Box :is v-bind='props'>
		<slot />
	</Box>
</template>
