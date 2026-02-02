<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'

import { toRefs } from '@vueuse/core'

import type { CalendarParams } from '../../model'

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

const date = defineModel<DateInput>('date', { required: true })

const refs = toRefs(props)
const state = useCalendar(date, refs)

const { config } = useProvideCalendarState(state)
</script>

<template>
	<Box>
		<slot :config />
	</Box>
</template>
