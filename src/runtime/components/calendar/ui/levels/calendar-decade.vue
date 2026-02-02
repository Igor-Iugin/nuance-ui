<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { isAfter, isBefore } from '@formkit/tempo'
import { chunk } from '@nui/utils'
import { computed } from 'vue'

import type { CalendarCellProps } from '../core'

import Box from '../../../box.vue'
import { useCalendarState } from '../../lib/context'
import { useCalendarSelectionState } from '../../lib/use-calendar-selection'
import { CalendarCell } from '../core'


export interface CalendarDecadeProps extends CalendarCellProps {
	date: DateInput

	/** Controls size */
	size?: NuanceSize

	selectable?: boolean
}

const { date, size, selectable } = defineProps<CalendarDecadeProps>()

const emit = defineEmits<{
	select: [date: DateInput]
}>()

const ctx = useCalendarState()

const startYear = computed(() => new Date(date).getFullYear())
const yearList = computed(() => {
	const years: number[] = []
	const base = startYear.value

	for (let ix = 0; ix < 10; ix++) {
		years.push(base + ix)
	}

	return chunk(years, 3)
})

const today = new Date()
const currentYear = today.getFullYear()

const isToday = (year: number) => year === currentYear

function isDisabled(year: number) {
	if (ctx.disabled)
		return true

	// The year is disabled if the entire year is after the maxDate
	const firstDayOfYear = new Date(year, 0, 1)
	if (ctx.maxDate && isAfter(firstDayOfYear, ctx.maxDate))
		return true

	// The year is disabled if the whole year is before minDate
	const lastDayOfYear = new Date(year, 11, 31)
	if (ctx.minDate && isBefore(lastDayOfYear, ctx.minDate))
		return true

	return false
}

const selection = useCalendarSelectionState()
const isSelected = (year: number) => selection.isSelected(new Date(year, 0, 1))
const isInRange = (year: number) => selection.isInRange(new Date(year, 0, 1))
const isFirstInRange = (year: number) => selection.isFirstInRange(new Date(year, 0, 1))
const isLastInRange = (year: number) => selection.isLastInRange(new Date(year, 0, 1))

function handleSelect(year: number) {
	const yearDate = new Date(year, 0, 1)
	emit('select', yearDate)

	if (isDisabled(year) || !selectable || ctx.readonly)
		return

	selection.handleYearSelect(yearDate)
}
</script>

<template>
	<Box is='table' role='grid' tabindex='-1' :class='$style.table'>
		<tbody>
			<tr v-for='(years, yearsIx) in yearList' :key='`decade-${yearsIx}`'>
				<td v-for='year in years' :key='year'>
					<CalendarCell
						:class='$style.year'
						:mod='{
							"today": isToday(year),
							"selected": isSelected(year),
							"in-range": isInRange(year),
							"first-in-range": isFirstInRange(year),
							"last-in-range": isLastInRange(year),
						}'
						:disabled='isDisabled(year)'
						:size
						@click='handleSelect(year)'
					>
						{{ year }}
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
