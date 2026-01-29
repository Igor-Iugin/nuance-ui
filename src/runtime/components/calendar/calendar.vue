<script setup lang='ts'>
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { addMonth, addYear } from '@formkit/tempo'
import { computed } from 'vue'

import type { CalendarLevel } from './model'
import type { CalendarRootProps } from './ui/core'

import {	CalendarHeader, CalendarRoot } from './ui/core'
import {	CalendarMonth, CalendarYear } from './ui/levels'


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
			return date
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
</script>

<template>
	<CalendarRoot
		v-slot='{ grid }'
		v-model:date='date'
		v-bind='props'
		:class='$style.content'
		@prev='handleMove(-1)'
		@next='handleMove(1)'
	>
		<section v-for='(month, ix) in grid' :key='`table-${month.value.toString()}`'>
			<CalendarHeader
				:date='getLevelDate(month.value, ix)'
				:format='levelFormat'
				:with-prev='ix === 0'
				:with-next='ix === grid.length - 1'
				@level='level = nextLevel()'
			/>

			<CalendarMonth
				v-if='level === "month"'
				:month
				:with-week-numbers
				:size
			/>
			<CalendarYear
				v-if='level === "year"'
				:year='getLevelDate(month.value, ix)'
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
