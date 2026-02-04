<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { date, isAfter, isBefore, range } from '@formkit/tempo'
import { isSameMonth } from '@nui/helpers/date'
import { chunk } from '@nui/utils'
import { computed } from 'vue'

import type { CalendarCellProps } from '../core'

import Box from '../../../box.vue'
import { useCalendarState } from '../../lib/context'
import { useCalendarSelectionState } from '../../lib/use-calendar-selection'
import { CalendarCell } from '../core'


export interface CalendarYearProps extends CalendarCellProps {
	year: DateInput

	/** Controls size */
	size?: NuanceSize | string

	selectable?: boolean
}

const { year, size, selectable } = defineProps<CalendarYearProps>()

const emit = defineEmits<{
	select: [date: DateInput]
}>()

const ctx = useCalendarState()
const dateYear = computed(() => date(year).getFullYear())

const monthList = computed(() => {
	const months =	range('MMMM', ctx.config.value.locale, ctx.config.value.genitive)
		.map((label, ix) => ({ label, ix }))
	return chunk(months, 3)
})

const isToday = (month: number) => isSameMonth(new Date(dateYear.value, month), new Date())
function isDisabled(month: number) {
	if (ctx.disabled)
		return true

	const firstDayOfMonth = new Date(dateYear.value, month, 1)
	const lastDayOfMonth = new Date(dateYear.value, month + 1, 0)

	// The month is disabled if the entire month is after the maxDate
	if (ctx.maxDate && isAfter(firstDayOfMonth, ctx.maxDate))
		return true

	// The month is disabled if the whole month is before minDate
	if (ctx.minDate && isBefore(lastDayOfMonth, ctx.minDate))
		return true

	return false
}

const selection = useCalendarSelectionState()
const isSelected = (month: number) => selection.isSelected(new Date(dateYear.value, month, 1))
const isInRange = (month: number) => selection.isInRange(new Date(dateYear.value, month, 1))
const isFirstInRange = (month: number) => selection.isFirstInRange(new Date(dateYear.value, month, 1))
const isLastInRange = (month: number) => selection.isLastInRange(new Date(dateYear.value, month, 1))

function handleSelect(month: number) {
	const monthDate = new Date(dateYear.value, month, 1)
	emit('select', monthDate)

	if (isDisabled(month) || !selectable || ctx.readonly)
		return

	selection.select(monthDate)
}
</script>

<template>
	<Box is='table' role='grid' tabindex='-1' :class='$style.table'>
		<tbody>
			<tr v-for='(months, seasonIx) in monthList' :key='`${year}-${seasonIx}`'>
				<td v-for='month in months' :key='`${year}-${month.ix}`'>
					<CalendarCell
						:class='$style.year'
						:mod='{
							"today": isToday(month.ix),
							"selected": isSelected(month.ix),
							"in-range": isInRange(month.ix),
							"first-in-range": isFirstInRange(month.ix),
							"last-in-range": isLastInRange(month.ix),
						}'
						:disabled='isDisabled(month.ix)'
						:size
						@click='handleSelect(month.ix)'
					>
						{{ month.label }}
					</CalendarCell>
				</td>
			</tr>
		</tbody>
	</Box>
</template>

<style lang="postcss" module>
.table {
	table-layout: fixed;
}

.year {
	--day-size-xs: 1.875rem;
	--day-size-sm: 2.25rem;
	--day-size-md: 2.625rem;
	--day-size-lg: 3rem;
	--day-size-xl: 3.375rem;

	height: var(--day-size);
	width: calc((var(--day-size) * 7) / 3 + .09375rem);
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	text-transform: capitalize;
}
</style>
