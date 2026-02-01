<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'

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
		<slot />
	</Box>
</template>
