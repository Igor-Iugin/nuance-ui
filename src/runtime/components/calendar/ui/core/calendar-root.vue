<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { CalendarGrid } from '@nui/helpers/date'

import { toRefs } from '@vueuse/core'

import type { CalendarEmits, CalendarParams } from '../../model'

import Box from '../../../box.vue'
import { useProvideCalendarState } from '../../lib/context'
import { useCalendar } from '../../lib/use-calendar'


export interface CalendarRootProps extends CalendarParams {
}

const props = withDefaults(defineProps<CalendarRootProps>(), {
	hideOutsideDates: false,
	pagedNavigation: false,
	weekdayFormat: 'ddd',
	fixedWeeks: false,
	multiple: false,
	numberOfMonths: 1,
	disabled: false,
	readonly: false,
	hideWeekdays: false,
	highlightToday: true,
})

const emit = defineEmits<CalendarEmits>()

defineSlots<{
	default: (props: {
		/** The grid of dates */
		grid: CalendarGrid[]
	}) => any
}>()

const date = defineModel<DateInput>('date', { required: true })

const prevPage = () => emit('prev', date.value)
const nextPage = () => emit('next', date.value)

const refs = toRefs(props)
const { grid, ...state } = useCalendar(date, {
	...refs,
	prevPage,
	nextPage,
})

useProvideCalendarState(state)
</script>

<template>
	<Box>
		<slot :grid />
	</Box>
</template>
