<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { DateMatcher } from '@nui/helpers/date'
import type { NuanceSize } from '@nui/types'

import { isAfter, isBefore, sameDay } from '@formkit/tempo'
import { createMonth, getWeekNumber, isSameMonth, isWeekend as isWeekendDay } from '@nui/helpers/date'
import { shallowRef, watch } from 'vue'

import Box from '../../../box.vue'
import { useCalendarState } from '../../lib/context'
import { useCalendarSelectionState } from '../../lib/use-calendar-selection'
import { CalendarCell } from '../core'


export interface CalendarMonthProps {
	month: string

	/** Detects the presence of spaces between cells. @default `true` */
	withCellSpacing?: boolean

	/** Controls size */
	size?: NuanceSize | string

	/** Determines whether week numbers should be displayed @default `false` */
	withWeekNumbers?: boolean
}

const { month, size, withWeekNumbers, withCellSpacing = true } = defineProps<CalendarMonthProps>()

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

const isWeekend: DateMatcher = day => isWeekendDay(day, ctx.config.value.firstDayOfWeek)
const isOutside: DateMatcher = day => !isSameMonth(day, month)
const isToday: DateMatcher = day => !!ctx.highlightToday && sameDay(day, today)
const isDisabled: DateMatcher = day => {
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
	selection.select(day)
}
</script>

<template>
	<table :class='$style.table' role='grid' tabindex='-1'>
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
			<Box
				is='tr'
				v-for='(week, weekIx) in weeks'
				:key='`week-${weekIx}`'
				:class='$style.row'
				:mod='{ selectable: selection.mode === "week" }'
			>
				<td v-if='withWeekNumbers' :class='$style.weeknumber'>
					{{ getWeekNumber(week[0]!, 1) }}
				</td>
				<Box
					is='td'
					v-for='(day, dayIx) in week'
					:key='`day-${dayIx}`'
					:class='$style.cell'
					role='gridcell'
					:mod='{ "with-spacing": withCellSpacing }'
				>
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
				</Box>
			</Box>
		</tbody>
	</table>
</template>

<style lang="postcss" module>
.table {
	table-layout: fixed;
	border-collapse: collapse;
}

.row:where([data-selectable]):hover {
	@mixin light {
		background-color: var(--color-gray-0);
	}

	@mixin dark {
		background-color: var(--color-dark-5);
	}
}

.cell {
	padding: 0;

	&:where(&[data-with-spacing]) {
		padding: var(--calendar-cell-spacing);
	}
}

.weekday {
	color: var(--color-dimmed);
	font-weight: normal;
	font-size: var(--wr-fz, var(--font-size-sm));
	text-transform: capitalize;
	padding-bottom: calc(var(--wr-spacing, var(--spacing-sm)) / 2);
}
</style>
