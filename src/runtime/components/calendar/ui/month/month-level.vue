<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'

import { isAfter, isBefore, monthEnd, monthStart, format as tFormat } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { computed } from 'vue'

import type { CalendarHeaderEmits, CalendarHeaderProps } from '../calendar-header.vue'
import type { CalendarMonthProps } from './calendar-month.vue'

import Box from '../../../box.vue'
import CalendarHeader from '../calendar-header.vue'
import CalendarMonth from './calendar-month.vue'


export interface MonthLevelProps extends CalendarMonthProps, CalendarHeaderProps {
	date: DateInput
	/** Level format */
	monthLabelFormat?: string
}

const {
	date,
	is = 'section',
	mod,
	monthLabelFormat = 'MMMM YYYY',
	config,
	size,

	// calendar-header props
	minDate,
	maxDate,
	withNext = true,
	nextIcon,
	nextLabel,
	nextDisabled,
	withPrev = true,
	prevIcon,
	prevLabel,
	prevDisabled = false,
	hasNextLevel = true,
	levelControlAriaLabel,

	// month props
	excludeDate,
	hideOutsideDates = false,
	hideWeekdays = false,
	highlightToday = false,
	static: isStatic,
	weekdayFormat,
	withCellSpacing = true,
	withWeekNumbers = false,
} = defineProps<MonthLevelProps>()

defineEmits<CalendarHeaderEmits>()

const cfg = config ?? useDatesConfig()
const label = computed(() => tFormat({	date,	format: monthLabelFormat,	...cfg }))
</script>

<template>
	<Box :is :mod>
		<CalendarHeader
			:date='date'
			:config
			:with-prev
			:prev-icon
			:prev-label
			:prev-disabled='
				typeof prevDisabled === "boolean"
					? prevDisabled
					: minDate ? !isAfter(minDate, monthEnd(date)) : false
			'
			:with-next
			:next-icon
			:next-label
			:next-disabled='
				typeof nextDisabled === "boolean"
					? nextDisabled
					: maxDate ? !isBefore(maxDate, monthStart(date)) : false
			'
			:has-next-level
			:level-control-aria-label
			:size
			@next='$emit("next")'
			@prev='$emit("prev")'
			@level='$emit("level")'
		>
			{{ label }}
		</CalendarHeader>
		<CalendarMonth
			:date
			:config
			:exclude-date
			:hide-outside-dates
			:hide-weekdays
			:highlight-today
			:with-week-numbers
			:with-cell-spacing
			:static='isStatic'
			:weekday-format
			:size
		>
			<template v-if='!!$slots.day' #day='{ date: day, outside, weekend }'>
				<slot name='day' :date='day' :outside :weekend />
			</template>
		</CalendarMonth>
	</Box>
</template>
