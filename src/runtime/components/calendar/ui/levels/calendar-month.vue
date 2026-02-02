<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { isAfter, isBefore, sameDay } from '@formkit/tempo'
import { createMonth, getWeekNumber, isSameMonth, isWeekend as isWeekendDay } from '@nui/helpers/date'
import { shallowRef, watch } from 'vue'

import { useCalendarState } from '../../lib/context'
import { useCalendarSelectionState } from '../../lib/use-calendar-selection'
import { CalendarCell } from '../core'


export interface CalendarMonthProps {
	month: string

	/** Controls size */
	size?: NuanceSize

	/** Determines whether week numbers should be displayed @default `false` */
	withWeekNumbers?: boolean
}

const { month, size, withWeekNumbers } = defineProps<CalendarMonthProps>()


const emit = defineEmits<{
	select: [date: DateInput]
}>()


const ctx = useCalendarState()
const weeks = shallowRef(createMonth({
	date: month,
	config: ctx.config.value,
	fixedWeeks: ctx.fixedWeeks,
}))

watch(() => month, (date, oldDate) => {
	if (date === oldDate)
		return

	weeks.value = createMonth({
		date,
		config: ctx.config.value,
		fixedWeeks: ctx.fixedWeeks,
	})
})

const today = new Date()

const isWeekend = (day: DateInput) => isWeekendDay(day, ctx.config.value.firstDayOfWeek)
const isOutside = (day: DateInput) => !isSameMonth(day, month)
const isToday = (day: DateInput) => !!ctx.highlightToday && sameDay(day, today)
function isDisabled(day: DateInput) {
	if (ctx.excludeDate?.(day) || ctx.disabled)
		return true
	if (ctx.maxDate && isAfter(day, ctx.maxDate))
		return true
	if (ctx.minDate && (isBefore(day, ctx.minDate) && !sameDay(day, ctx.minDate)))
		return true

	return false
}

const selection = useCalendarSelectionState()
function handleSelect(event: PointerEvent) {
	const target = event.target as HTMLElement
	const cell = target.closest('[data-value]') as HTMLElement | null
	const day = cell?.dataset?.value

	if (!day || isDisabled(day) || ctx.readonly)
		return

	emit('select', day)
	selection.handleDaySelect(day)
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

		<tbody @click='handleSelect'>
			<tr v-for='(week, weekIx) in weeks' :key='`week-${weekIx}`'>
				<td v-if='withWeekNumbers' :class='$style.weeknumber'>
					{{ getWeekNumber(week[0]!, 1) }}
				</td>
				<td v-for='(day, dayIx) in week' :key='`day-${dayIx}`' role='gridcell'>
					<CalendarCell
						:size
						:mod='{
							"value": day,
							"today": isToday(day),
							"outside": isOutside(day),
							"weekend": isWeekend(day),
							"hidden": ctx.hideOutsideDates.value && isOutside(day),
							"selected": selection.isSelected(day),
							"in-range": selection.isInRange(day),
							"first-in-range": selection.isFirstInRange(day),
							"last-in-range": selection.isLastInRange(day),
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
