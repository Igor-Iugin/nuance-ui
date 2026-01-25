<script setup lang="ts">
import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'


export interface CalendarHeaderProps extends BoxProps {}

const { is = 'header', ...props } = defineProps<CalendarHeaderProps>()
</script>

<template>
	<Box :is v-bind='props'>
		<slot />
	</Box>
</template>
