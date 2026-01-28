<script setup lang='ts'>
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { addMonth } from '@formkit/tempo'
import { getWeekNumber } from '@nui/helpers/date'

import type { CalendarRootProps } from './ui/core'

import {
	CalendarCell,
	CalendarCellTrigger,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHead,
	CalendarGridHeadCell,
	CalendarGridRow,
	CalendarHeader,
	CalendarHeading,
	CalendarNext,
	CalendarPrev,
	CalendarRoot,
} from './ui/core'


export interface CalendarProps extends CalendarRootProps {
	/** Controls size */
	size?: NuanceSize

	/** Determines whether week numbers should be displayed @default `false` */
	withWeekNumbers?: boolean
}

const {
	withWeekNumbers,
	numberOfMonths = 1,
	size,
	...props
} = defineProps<CalendarProps>()

const date = defineModel<DateInput>('date', { required: true })
</script>

<template>
	<CalendarRoot
		v-slot='{ weekDays, grid }'
		v-model:date='date'
		v-bind='props'
		:number-of-months
		:class='$style.content'
		@next='date = addMonth(date, numberOfMonths)'
		@prev='date = addMonth(date, -numberOfMonths)'
	>
		<section v-for='(month, ix) in grid' :key='`table-${month.value.toString()}`'>
			<CalendarHeader>
				<CalendarPrev v-if='ix === 0' />
				<CalendarHeading :month='month.value' />
				<CalendarNext v-if='ix === grid.length - 1' />
			</CalendarHeader>
			<CalendarGrid :key='`grid-${month.value.toString()}`'>
				<CalendarGridHead>
					<CalendarGridRow>
						<CalendarGridHeadCell v-if='withWeekNumbers' />
						<CalendarGridHeadCell v-for='day in weekDays' :key='day'>
							<slot name='weekday' :day='day'>
								{{ day }}
							</slot>
						</CalendarGridHeadCell>
					</CalendarGridRow>
				</CalendarGridHead>
				<CalendarGridBody>
					<CalendarGridRow v-for='(week, weekIx) in month.rows' :key='`week-row-${weekIx}`'>
						<td v-if='withWeekNumbers' :class='$style.weeknumber'>
							{{ getWeekNumber(week[0]!, 1) }}
						</td>
						<CalendarCell v-for='day in week' :key='day'>
							<CalendarCellTrigger
								v-slot='cell'
								:key='`m${month.value.toString()}-d${day}`'
								:day
								:month='month.value'
								:size
							>
								<slot name='day' :day='day' v-bind='cell'>
									{{ cell.label }}
								</slot>
							</CalendarCellTrigger>
						</CalendarCell>
					</CalendarGridRow>
				</CalendarGridBody>
			</CalendarGrid>
		</section>
	</CalendarRoot>
</template>

<style lang="postcss" module>
.content {
	display: flex;
	gap: var(--spacing-sm);
	width: fit-content;
}

.weeknumber {
  --wn-size-xs: rem(30px);
  --wn-size-sm: rem(36px);
  --wn-size-md: rem(42px);
  --wn-size-lg: rem(48px);
  --wn-size-xl: rem(54px);

  color: var(--color-dimmed);
  font-weight: normal;
  font-size: calc(var(--wn-size, var(--wn-size-sm)) / 2.8);
  text-align: center;
  width: var(--wn-size, var(--wn-size-sm));
}
</style>
