<script setup lang="ts" generic="T extends SelectionMode = 'single'">
import type { DateInput, FormatToken } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { DateMatcher } from '@nui/helpers/date'

import { range } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { computed } from 'vue'

import type { DateSelection, SelectionMode } from '../../model'

import Box from '../../../box.vue'
import { useProvideCalendarState } from '../../lib/context'
import { useCalendarSelection } from '../../lib/use-calendar-selection'


export interface CalendarRootProps<T extends SelectionMode> {
	/** Selection mode @default 'single' */
	mode?: T

	/** The number of months to display at once @default `1` */
	numberOfMonths?: number

	/** `@formkit/tempo` format for weekdays names @default `'ddd'` */
	weekdayFormat?: FormatToken

	/** Whether or not to always display 6 weeks in the calendar */
	fixedWeeks?: boolean

	/** Minimum possible date */
	minDate?: DateInput

	/** Maximum possible date */
	maxDate?: DateInput

	/** Callback function to determine whether the day should be disabled */
	excludeDate?: DateMatcher

	/** Determines whether today should be highlighted with a border @default `false` */
	highlightToday?: boolean

	/** Determines whether outside dates should be hidden @default `false` */
	hideOutsideDates?: boolean

	/** Whether the calendar is disabled */
	disabled?: boolean

	/** Whether the calendar is readonly */
	readonly?: boolean

	/** `@formkit/tempo` locale config */
	config?: DateConfig
}

const props = withDefaults(defineProps<CalendarRootProps<T>>(), {
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
	mode: 'single' as any,
})

const emit = defineEmits<{ select: [DateSelection<T>] }>()

const date = defineModel<DateInput>('date', { required: true })

const config = useDatesConfig(props.config)
const hideOutsideDates = computed(() => (props.numberOfMonths && props.numberOfMonths > 1) || props.hideOutsideDates)

const weekdays = computed(() => {
	const days = range(props.weekdayFormat, config?.locale, config?.genitive)

	if (config.firstDayOfWeek === 1) {
		return [
			...days.slice(config.firstDayOfWeek),
			...days.slice(0, config.firstDayOfWeek),
		]
	}

	return days
})

const select = defineModel<DateSelection<T>>('select', {
	default: ({ mode }) => {
		switch (mode) {
			case 'single':
				return null
			case 'range':
				return [null, null]
			case 'week':
				return [null, null]
			case 'multiple':
				return []
			default:
				return null
		}
	},
})

useProvideCalendarState({
	date,
	weekdays,
	config,
	hideOutsideDates,
	fixedWeeks: props.fixedWeeks,
	disabled: props.disabled,
	excludeDate: props.excludeDate,
	highlightToday: props.highlightToday,
	maxDate: props.maxDate,
	minDate: props.minDate,
	readonly: props.readonly,
	weekdayFormat: props.weekdayFormat,
})

useCalendarSelection({
	value: select,
	mode: props.mode,
	config,
	readonly: props.readonly,
	onSelect: data => emit('select', data),
})
</script>

<template>
	<Box>
		<slot :config />
	</Box>
</template>
