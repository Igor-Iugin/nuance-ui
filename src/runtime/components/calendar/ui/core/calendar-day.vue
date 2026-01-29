<script setup lang='ts'>
import type { DateInput } from '@formkit/tempo'

import { format } from '@formkit/tempo'
import { computed } from 'vue'

import type { CalendarCellProps } from './calendar-cell.vue'

import { useCalendarState } from '../../lib/context'
import CalendarCell from './calendar-cell.vue'


export interface CalendarDayProps extends CalendarCellProps {
	/** The date value provided to the cell trigger */
	day: DateInput
	/** The month in which the cell is rendered */
	month: DateInput
}

const { size, day, month } = defineProps<CalendarDayProps>()

defineSlots<{
	default: [{
		label: string
		/** Current day */
		date: string
		/** Current month */
		month: string
		/** Current disable state */
		disabled: boolean
		/** Current selected state */
		selected: boolean
		/** Current today state */
		today: boolean
		/** Current outside view state */
		outside: boolean
		/** Current weekend view state */
		weekend: boolean
	}]
}>()

const ctx = useCalendarState()

const label = computed(() => format({ date: day, format: 'D', ...ctx.config }))

const outside = computed(() => ctx.isOutside(day, month))
const hidden = computed(() => ctx.hideOutsideDates.value && outside.value)
const today = computed(() => ctx.isToday(day))
const disabled = computed(() => ctx.isDisabled(day) || hidden.value)
const weekend = computed(() => ctx.isWeekend(day))

function changeDate(date: DateInput) {
	if (ctx.readonly.value)
		return
	if (disabled.value)
		return

	return console.log(date)
	// ctx.onDateChange(date)
}

const onClick = () => !disabled.value && changeDate(day)
</script>

<template>
	<CalendarCell
		:aria-label='label'
		:mod='{
			today,
			outside,
			disabled,
			weekend,
			hidden,
		}'
		:disabled
		:size
		:tabindex='outside || disabled ? undefined : -1'
		@click='onClick'
	>
		<slot
			:date='day'
			:month
			:label
			:today
			:outside
			:disabled
			:weekend
			:hidden
		>
			{{ label }}
		</slot>
	</CalendarCell>
</template>
