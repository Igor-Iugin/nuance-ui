<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { CalendarGrid } from '@nui/helpers/date'
import type { NuanceSize } from '@nui/types'

import { getWeekNumber } from '@nui/helpers/date'

import Box from '../../../box.vue'
import { useCalendarState } from '../../lib/context'
import { CalendarDay } from '../core'


export interface CalendarMonthProps {
	month: CalendarGrid

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
</script>

<template>
	<Box is='table' role='grid' tabindex='-1'>
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
			<tr v-for='(week, weekIx) in month.rows' :key='`week-row-${weekIx}`'>
				<td v-if='withWeekNumbers' :class='$style.weeknumber'>
					{{ getWeekNumber(week[0]!, 1) }}
				</td>
				<td v-for='(day, dayIx) in week' :key='dayIx' role='gridcell'>
					<CalendarDay
						v-slot='cell'
						:key='dayIx'
						:month='month.value'
						:day
						:size
						@click='$emit("select", day)'
					>
						<slot name='day' :day='day' v-bind='cell'>
							{{ cell.label }}
						</slot>
					</CalendarDay>
				</td>
			</tr>
		</tbody>
	</Box>
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
