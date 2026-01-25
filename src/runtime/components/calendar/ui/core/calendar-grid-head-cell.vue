<script setup lang="ts">
import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'


export interface CalendarGridHeadCellProps extends BoxProps {}

const { is = 'th', ...props } = defineProps<CalendarGridHeadCellProps>()
</script>

<template>
	<Box :is v-bind='props'>
		<slot />
	</Box>
</template>
