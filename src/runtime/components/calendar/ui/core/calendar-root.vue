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
	highlightToday: false,
})

const emit = defineEmits<CalendarEmits>()

defineSlots<{
	default: (props: {
		/** The current date of the placeholder */
		date: DateInput
		/** The grid of dates */
		grid: CalendarGrid[]
		/** The days of the week */
		weekDays: string[]
	}) => any
}>()

const date = defineModel<DateInput>('date', { required: true })

const prevPage = () => emit('prev', date.value)
const nextPage = () => emit('next', date.value)

const refs = toRefs(props)
const state = useCalendar(date, {
	...refs,
	prevPage,
	nextPage,
})

useProvideCalendarState(state)
</script>

<template>
	<Box>
		<slot :date :grid='state.grid.value' :week-days='state.weekdays.value' />
	</Box>
</template>
