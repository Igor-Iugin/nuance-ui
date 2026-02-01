<script setup lang='ts'>
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { addMonth, addYear, date as fDate, format } from '@formkit/tempo'
import { computed } from 'vue'

import type { CalendarLevel } from './model'
import type { CalendarRootProps } from './ui/core'

import {	CalendarHeader, CalendarRoot } from './ui/core'
import {	CalendarDecade, CalendarMonth, CalendarYear } from './ui/levels'


export interface CalendarProps extends CalendarRootProps {
	/** Controls size */
	size?: NuanceSize

	/** Determines whether week numbers should be displayed @default `false` */
	withWeekNumbers?: boolean

	defaultLevel?: CalendarLevel
}

const props = withDefaults(defineProps<CalendarProps>(), {
	hideOutsideDates: false,
	pagedNavigation: false,
	weekdayFormat: 'ddd',
	fixedWeeks: false,
	multiple: false,
	numberOfMonths: 1,
	disabled: false,
	readonly: false,
	hideWeekdays: false,
	highlightToday: true,

	defaultLevel: 'year',
	withWeekNumbers: false,
})

const date = defineModel<DateInput>('date', { required: true })
const level = defineModel<CalendarLevel>('level', { default: 'month' })

const calendars = computed(() => {
	const dates: string[] = []

	for (let ix = 0; ix < props.numberOfMonths; ix++) {
		switch (level.value) {
			case 'month':
				dates.push(format(addMonth(date.value, ix), 'YYYY-MM-DD'))
				break
			case 'year':
				dates.push(format(addYear(date.value, ix), 'YYYY-MM-DD'))
				break
			case 'decade':
				dates.push(format(addYear(date.value, ix * 10), 'YYYY-MM-DD'))
				break
		}
	}

	return dates
})

const levelFormat = computed(() => {
	switch (level.value) {
		case 'month':
			return 'MMMM YYYY'
		case 'year':
			return 'YYYY'
		default:
			return 'MMMM YYYY'
	}
})

function getLevelDate(date: DateInput, ix: number) {
	switch (level.value) {
		case 'month':
			return date
		case 'year':
			return addYear(date, ix)
		default:
			return addYear(date, ix * 10)
	}
}

function nextLevel() {
	switch (level.value) {
		case 'month':
			return 'year'
		case 'year':
			return 'decade'
		case 'decade':
			return level.value
	}
}

function handleMove(dir: -1 | 1) {
	switch (level.value) {
		case 'month':
			return date.value = addMonth(date.value, props.numberOfMonths * dir)
		case 'year':
			return date.value = addYear(date.value, props.numberOfMonths * dir)
		case 'decade':
			return date.value = addYear(date.value, props.numberOfMonths * (dir * 10))
	}
}

function getDecadeLabel(start: DateInput) {
	const startYear = fDate(start)
	const endYear = addYear(start, 9)

	return `${startYear.getFullYear()} - ${endYear.getFullYear()}`
}
</script>

<template>
	<CalendarRoot
		v-model:date='date'
		v-bind='props'
		:class='$style.content'
		@prev='handleMove(-1)'
		@next='handleMove(1)'
	>
		<section v-for='(calendar, ix) in calendars' :key='`calendar-${ix}`'>
			<CalendarHeader
				:date='getLevelDate(calendar, ix)'
				:format='levelFormat'
				:with-prev='ix === 0'
				:with-next='ix === calendars.length - 1'
				@level='level = nextLevel()'
			>
				<template v-if='level === "decade"' #label>
					{{ getDecadeLabel(getLevelDate(calendar, ix)) }}
				</template>
			</CalendarHeader>

			<CalendarMonth
				v-if='level === "month"'
				:month='calendar'
				:with-week-numbers
				:size
			/>
			<CalendarYear
				v-if='level === "year"'
				:year='calendar'
				:size
			/>
			<CalendarDecade
				v-if='level === "decade"'
				:date='calendar'
				:size
			/>
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

.weekday {
  color: var(--color-dimmed);
  font-weight: normal;
  font-size: var(--wr-fz, var(--font-size-sm));
  text-transform: capitalize;
  padding-bottom: calc(var(--wr-spacing, var(--spacing-sm)) / 2);
}
</style>
