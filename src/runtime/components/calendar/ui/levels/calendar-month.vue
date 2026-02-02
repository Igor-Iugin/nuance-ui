<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { isAfter, isBefore, sameDay } from '@formkit/tempo'
import { createMonth, getWeekNumber, isSameMonth, isWeekend as isWeekendDay } from '@nui/helpers/date'
import { shallowRef, watch } from 'vue'

import { useCalendarState } from '../../lib/context'
import { CalendarCell } from '../core'


export interface CalendarMonthProps {
	month: string

	/** Controls size */
	size?: NuanceSize

	/** Determines whether week numbers should be displayed @default `false` */
	withWeekNumbers?: boolean
}

const { month, size, withWeekNumbers } = defineProps<CalendarMonthProps>()


defineEmits<{
	select: [date: DateInput]
}>()


const ctx = useCalendarState()
const weeks = shallowRef(createMonth({
	date: month,
	config: ctx.config,
	fixedWeeks: ctx.fixedWeeks.value,
}))

watch(() => month, (date, oldDate) => {
	if (date === oldDate)
		return

	weeks.value = createMonth({
		date,
		config: ctx.config,
		fixedWeeks: ctx.fixedWeeks.value,
	})
})

const today = new Date()

const isWeekend = (day: DateInput) => isWeekendDay(day, ctx.config.firstDayOfWeek)
const isOutside = (day: DateInput) => !isSameMonth(day, month)
const isToday = (day: DateInput) => !!ctx.highlightToday.value && sameDay(day, today)
function isDisabled(day: DateInput) {
	if (ctx.excludeDate?.value?.(day) || ctx.disabled.value)
		return true
	if (ctx.maxDate.value && isAfter(day, ctx.maxDate.value))
		return true
	if (ctx.minDate.value && (isBefore(day, ctx.minDate.value) && !sameDay(day, ctx.minDate.value)))
		return true

	return false
}
</script>

<template>
	<table role='grid' tabindex='-1'>
		<thead>
			<tr>
				<th v-if='withWeekNumbers' :class='$style.weekday'>
					#
				</th>
				<th v-for='day in ctx.weekdays.value' :key='day' :class='$style.weekday'>
					<slot name='weekday' :day='day'>
						{{ day }}
					</slot>
				</th>
			</tr>
		</thead>

		<tbody>
			<tr v-for='(week, weekIx) in weeks' :key='`week-${weekIx}`'>
				<td v-if='withWeekNumbers' :class='$style.weeknumber'>
					{{ getWeekNumber(week[0]!, 1) }}
				</td>
				<td v-for='(day, dayIx) in week' :key='`day-${dayIx}`' role='gridcell'>
					<CalendarCell
						:size
						:mod='{
							today: isToday(day),
							outside: isOutside(day),
							weekend: isWeekend(day),
							hidden: ctx.hideOutsideDates.value && isOutside(day),
						}'
						:disabled='isDisabled(day)'
					>
						<slot>
							{{ new Date(day).getDate() }}
						</slot>
					</CalendarCell>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style lang="postcss" module>
.weekday {
  color: var(--color-dimmed);
  font-weight: normal;
  font-size: var(--wr-fz, var(--font-size-sm));
  text-transform: capitalize;
  padding-bottom: calc(var(--wr-spacing, var(--spacing-sm)) / 2);
}
</style>
