<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { addYear, format, sameYear } from '@formkit/tempo'
import { chunk } from '@nui/utils'
import { computed } from 'vue'

import type { CalendarCellProps } from '../core'

import Box from '../../../box.vue'
import { useCalendarState } from '../../lib/context'
import { CalendarCell } from '../core'


export interface CalendarDecadeProps extends CalendarCellProps {
	year: DateInput

	/** Controls size */
	size?: NuanceSize
}

const { year, size } = defineProps<CalendarDecadeProps>()

defineEmits<{
	select: [date: DateInput]
}>()

const ctx = useCalendarState()
const yearList = computed(() => {
	const years: string[] = []

	for (let ix = 0; ix < 10; ix++) {
		years.push(format(addYear(year, ix), 'YYYY-MM-DD'))
	}

	return chunk(years, 3)
})

const isToday = (year: string) => sameYear(year, ctx.date.value)
</script>

<template>
	<Box is='table' role='grid' tabindex='-1' :class='$style.table'>
		<tbody>
			<tr v-for='(years, yearsIx) in yearList' :key='`${year}-${yearsIx}`'>
				<td v-for='(year, yearIx) in years' :key='yearIx'>
					<CalendarCell
						:class='$style.year'
						:mod='{ today: isToday(year) }'
						:size
						@click='$emit("select", year)'
					>
						{{ year.split("-")[0] }}
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
