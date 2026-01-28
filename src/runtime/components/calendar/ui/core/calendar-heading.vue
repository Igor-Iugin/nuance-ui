<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'

import { format } from '@formkit/tempo'
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'
import { useCalendarState } from '../../lib/context'
import css from './styles/calendar-header.module.css'


export interface CalendarHeadingProps extends BoxProps {
	format?: string
	month?: DateInput
}

const {
	mod,
	month,
	format: lFormat = 'MMMM YYYY',
	...props
} = defineProps<CalendarHeadingProps>()

defineSlots<{
	default?: [{
		/** Formatted label */
		label: string
	}]
}>()

const ctx = useCalendarState()
const disabled = computed(() => ctx.disabled.value)
const label = computed(() => format({ date: month ?? ctx.date.value, format: lFormat, ...ctx.config }))
</script>

<template>
	<Box v-bind='props' :mod='[{ disabled }, mod]' :class='css.level'>
		<slot :label>
			{{ label }}
		</slot>
	</Box>
</template>
