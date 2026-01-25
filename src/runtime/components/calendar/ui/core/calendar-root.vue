<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { CalendarGrid, DateMatcher } from '@nui/helpers/date'
import type { Ref } from 'vue'

import { toRefs } from '@vueuse/core'

import Box from '../../../box.vue'
import { useProvideCalendarState } from '../../lib/context'
import { useCalendar } from '../../lib/use-calendar'


export interface CalendarRootProps {
	/** This property causes the previous and next buttons to navigate by the number of months displayed at once, rather than one month */
	pagedNavigation?: boolean
	/** Whether or not to prevent the user from deselecting a date without selecting another date first */
	preventDeselect?: boolean
	/** The format to use for the weekday strings provided via the weekdays slot prop */
	weekdayFormat?: string
	/** Whether or not to always display 6 weeks in the calendar */
	fixedWeeks?: boolean
	/** The maximum date that can be selected */
	maxDate?: DateInput
	/** The minimum date that can be selected */
	minDate?: DateInput
	/** The number of months to display at once */
	numberOfMonths?: number
	/** Whether the calendar is disabled */
	disabled?: boolean
	/** Whether the calendar is readonly */
	readonly?: boolean
	/** A function that returns whether or not a date is disabled */
	isDateDisabled?: DateMatcher
	/** The reading direction of the calendar when applicable. <br> If omitted, inherits globally from `ConfigProvider` or assumes LTR (left-to-right) reading mode. */
	dir?: 'rtl' | 'ltr'
	/** A function that returns the next page of the calendar. It receives the current date as an argument inside the component. */
	nextPage?: (date: DateInput) => DateInput
	/** A function that returns the previous page of the calendar. It receives the current date as an argument inside the component. */
	prevPage?: (date: DateInput) => DateInput
	/** Whether multiple dates can be selected */
	multiple?: boolean
	/** Whether or not to disable days outside the current view. */
	hideOutsideDates?: boolean
}

const props = withDefaults(defineProps<CalendarRootProps>(), {
	hideOutsideDates: false,
	pagedNavigation: false,
	weekdayFormat: 'narrow',
	fixedWeeks: false,
	multiple: false,
	numberOfMonths: 1,
	disabled: false,
	readonly: false,
})

defineSlots<{
	default: (props: {
		/** The current date of the placeholder */
		date: DateInput
		/** The grid of dates */
		grid: Ref<CalendarGrid[]>
		/** The days of the week */
		weekDays: string[]
	}) => any
}>()

const date = defineModel<DateInput>('date', { required: true })

const refs = toRefs(props)
const state = useCalendar({
	date,
	...refs,
	isDateDisabled: refs.isDateDisabled.value,
})

useProvideCalendarState(state)
</script>

<template>
	<Box>
		<slot :date :grid='state.grid' :week-days='state.weekdays' />
	</Box>
</template>
