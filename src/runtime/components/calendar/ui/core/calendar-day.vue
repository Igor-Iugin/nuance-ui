<script setup lang='ts'>
import { computed } from 'vue'

import type { CalendarCellProps } from './calendar-cell.vue'

import { useCalendarState } from '../../lib/context'
import CalendarCell from './calendar-cell.vue'


export interface CalendarDayProps extends CalendarCellProps {
	/** The date value provided to the cell trigger */
	day: string
	/** The month in which the cell is rendered */
	month: string
}

const { size, day, month } = defineProps<CalendarDayProps>()

const ctx = useCalendarState()
const outside = computed(() => ctx.isOutside(day, month))
const hidden = computed(() => ctx.hideOutsideDates.value && outside.value)
const today = computed(() => ctx.isToday(day))
const disabled = computed(() => ctx.isDisabled(day) || hidden.value)
const weekend = computed(() => ctx.isWeekend(day))

const mod = computed(() => ({
	'data-today': today.value || undefined,
	'data-outside': outside.value || undefined,
	'data-disabled': disabled.value || undefined,
	'data-weekend': weekend.value || undefined,
	'data-hidden': hidden.value || undefined,
}))
</script>

<template>
	<CalendarCell
		:mod
		:disabled
		:size
		:tabindex='outside || disabled ? undefined : -1'
	>
		<slot>
			{{ new Date(day).getDate() }}
		</slot>
	</CalendarCell>
</template>
