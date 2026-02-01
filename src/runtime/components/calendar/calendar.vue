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
				dates.push(addMonth(date.value, ix).toISOString())
				break
			case 'year':
				dates.push(addYear(date.value, ix).toISOString())
				break
			case 'decade':
				dates.push(addYear(date.value, ix * 10).toISOString())
				break
		}
	}

	return dates
})

function getLabel(date: DateInput) {
	switch (level.value) {
		case 'month':
			return format(date, 'MMMM YYYY')
		case 'year':
			return format(date, 'YYYY')
		case 'decade':
			return `${fDate(date).getFullYear()} - ${addYear(date, 9).getFullYear()}`
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

function move(dir: -1 | 1) {
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
		v-model:date='date'
		v-bind='props'
		:class='$style.content'
		@prev='move(-1)'
		@next='move(1)'
	>
		<section v-for='(calendar, ix) in calendars' :key='`calendar-${ix}`'>
			<CalendarHeader
				:with-prev='ix === 0'
				:with-next='ix === calendars.length - 1'
				@level='level = nextLevel()'
			>
				<template v-if='!!$slots.prevButton' #prevButton>
					<slot name='prevButton' />
				</template>
				<template #label>
					<slot name='level'>
						{{ getLabel(calendar) }}
					</slot>
				</template>
				<template v-if='!!$slots.nextButton' #nextButton>
					<slot name='nextButton' />
				</template>
			</CalendarHeader>

			<CalendarMonth
				v-if='level === "month"'
				:month='calendar'
				:with-week-numbers
				:size
			>
				<template v-if='!!$slots.weekday' #weekday>
					<slot name='weekday' />
				</template>
				<slot v-if='!!$slots.day' name='day' />
			</CalendarMonth>
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
