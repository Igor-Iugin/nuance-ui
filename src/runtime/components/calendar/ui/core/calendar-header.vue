<script setup lang="ts">
import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'
import css from './styles/calendar-header.module.css'


export interface CalendarHeaderProps extends BoxProps {}

const { is = 'header', ...props } = defineProps<CalendarHeaderProps>()
</script>

<template>
	<Box :is v-bind='props' :class='css.header'>
		<slot />
	</Box>
</template>
