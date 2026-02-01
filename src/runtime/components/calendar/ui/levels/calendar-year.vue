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
import { CalendarCell } from '../core'


export interface CalendarYearProps extends CalendarCellProps {
	year: DateInput

	/** Controls size */
	size?: NuanceSize
}

const { year, size } = defineProps<CalendarYearProps>()

defineEmits<{
	select: [date: DateInput]
}>()

const ctx = useCalendarState()
const dateYear = computed(() => date(year).getFullYear())

const monthList = computed(() => {
	const months =	range('MMMM', ctx.config.locale, ctx.config.genitive)
	return chunk(months.map((label, ix) => ({ label, ix })), 3)
})

const isToday = (month: number) => isSameMonth(new Date(dateYear.value, month), new Date())
function isDisabled(month: number) {
	if (ctx.disabled.value)
		return true

	const firstDayOfMonth = new Date(dateYear.value, month, 1)
	const lastDayOfMonth = new Date(dateYear.value, month + 1, 0)

	// The month is disabled if the entire month is after the maxDate
	if (ctx.maxDate.value && isAfter(firstDayOfMonth, ctx.maxDate.value))
		return true

	// The month is disabled if the whole month is before minDate
	if (ctx.minDate.value && isBefore(lastDayOfMonth, ctx.minDate.value))
		return true

	return false
}
</script>

<template>
	<Box is='table' role='grid' tabindex='-1' :class='$style.table'>
		<tbody>
			<tr v-for='(months, seasonIx) in monthList' :key='`${year}-${seasonIx}`'>
				<td v-for='month in months' :key='`${year}-${month.ix}`'>
					<CalendarCell
						:class='$style.year'
						:mod='{ today: isToday(month.ix) }'
						:disabled='isDisabled(month.ix)'
						:size
						@click='$emit("select", new Date(dateYear, month.ix))'
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
