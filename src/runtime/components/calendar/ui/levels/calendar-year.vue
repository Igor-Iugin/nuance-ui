<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { date, range } from '@formkit/tempo'
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
const monthList = computed(() => {
	const months =	range('MMMM', ctx.config.locale, ctx.config.genitive)
	return chunk(months, 3)
})

const dateYear = date(year).getFullYear()
const isToday = (month: number) => isSameMonth(new Date(dateYear, month), new Date())
</script>

<template>
	<Box is='table' role='grid' tabindex='-1' :class='$style.table'>
		<tbody>
			<tr v-for='(months, seasonIx) in monthList' :key='`${year}-${seasonIx}`'>
				<td v-for='(month, monthIx) in months' :key='monthIx'>
					<CalendarCell
						:class='$style.year'
						:mod='{ today: isToday(seasonIx * 3 + monthIx) }'
						:size
						@click='$emit("select", new Date(dateYear, seasonIx * 3 + monthIx))'
					>
						{{ month }}
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
