<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { createMonth, getWeekNumber } from '@nui/helpers/date'
import { shallowRef, watch } from 'vue'

import { useCalendarState } from '../../lib/context'
import { CalendarDay } from '../core'


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
				<td v-for='(day, ix) in week' :key='`day-${ix}`' role='gridcell'>
					<CalendarDay
						:month
						:day
						:size
						@click='$emit("select", day)'
					/>
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
