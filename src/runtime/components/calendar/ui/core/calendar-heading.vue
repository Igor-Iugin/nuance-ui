<script setup lang="ts">
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'
import { useCalendarState } from '../../lib/context'


export interface CalendarHeadingProps extends BoxProps {}

const { is, mod, ...props } = defineProps<CalendarHeadingProps>()

defineSlots<{
	default?: [{
		/** Current month and year */
		value: string
	}]
}>()

const ctx = useCalendarState()
const disabled = computed(() => ctx.disabled.value)
</script>

<template>
	<Box :is v-bind='props' :mod='[{ disabled }, mod]'>
		<slot :value='ctx.headingValue.value'>
			{{ ctx.headingValue }}
		</slot>
	</Box>
</template>
