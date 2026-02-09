<script setup lang='ts' generic="T extends SelectionMode = 'single'">
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import type { CalendarEmits, CalendarLevel, DateSelection, SelectionMode } from './model'
import type { CalendarRootProps } from './ui/core'

import { useCalendarNavigation } from './lib/use-calendar-navigation'
import {	CalendarHeader, CalendarRoot } from './ui/core'
import {	CalendarDecade, CalendarMonth, CalendarYear } from './ui/levels'


export interface CalendarProps<T extends SelectionMode = 'single'> extends CalendarRootProps<T> {
	/** Controls size */
	size?: NuanceSize | string

	/** Determines whether week numbers should be displayed @default `false` */
	withWeekNumbers?: boolean

	/** Callback function to determine whether the prev button should be disabled */
	prevDisabled?: (date: DateInput, level: CalendarLevel) => boolean

	/** Callback function to determine whether the next button should be disabled */
	nextDisabled?: (date: DateInput, level: CalendarLevel) => boolean

	/** Min level that user can go up to @default 'month' */
	minLevel?: CalendarLevel

	/** Max level that user can go up to @default 'decade' */
	maxLevel?: CalendarLevel

	/** Detects the presence of spaces between cells. @default `true` */
	withCellSpacing?: boolean
}

const props = withDefaults(defineProps<CalendarProps<T>>(), {
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
	mode: 'single' as any,

	withCellSpacing: true,

	withWeekNumbers: false,
	minLevel: 'month',
	maxLevel: 'decade',
})

defineEmits<CalendarEmits<T>>()

const date = defineModel<DateInput>('date', { default: new Date() })
const level = defineModel<CalendarLevel>('level', { default: ({ minLevel }) => minLevel })
const select = defineModel<DateSelection<T>>('value')

const [calendars, nav] = useCalendarNavigation({
	date,
	level,
	numberOfMonths: props.numberOfMonths,
	disabled: props.disabled,
	minDate: props.minDate,
	maxDate: props.maxDate,
	prevDisabled: props.prevDisabled,
	nextDisabled: props.nextDisabled,
	minLevel: props.minLevel,
	maxLevel: props.maxLevel,
})
</script>

<template>
	<CalendarRoot
		v-slot='{ config }'
		v-model:date='date'
		v-model:select='select'
		v-bind='props'
		:class='$style.content'
		@select='select => $emit("select", select)'
	>
		<section v-for='(calendar, ix) in calendars' :key='`calendar-${ix}`'>
			<CalendarHeader
				:with-prev='ix === 0'
				:with-next='ix === calendars.length - 1'
				:prev-disabled='nav.isPrevDisabled'
				:next-disabled='nav.isNextDisabled'
				@prev='() => {
					nav.move(-1)
					$emit("prev")
				}'
				@next='() => {
					nav.move(1)
					$emit("next")
				}'
				@level='() => {
					level = nav.nextLevel()
					$emit("level")
				}'
			>
				<slot name='level' :config>
					{{ nav.getLevelLabel(calendar, config) }}
				</slot>
			</CalendarHeader>

			<CalendarMonth
				v-if='level === "month"'
				:month='calendar'
				:with-week-numbers='props.withWeekNumbers'
				:with-cell-spacing='props.withCellSpacing'
				:size
			>
				<template v-if='!!$slots.weekday' #weekday>
					<slot name='weekday' />
				</template>

				<slot name='day' />
			</CalendarMonth>
			<CalendarYear
				v-if='level === "year"'
				:year='calendar'
				:size
				:selectable='props.minLevel === "year"'
				@select='month => {
					if (props.minLevel !== "year"){
						level = nav.prevLevel()
						date = month
					}
				}'
			/>
			<CalendarDecade
				v-if='level === "decade"'
				:date='calendar'
				:size
				:selectable='props.minLevel === "decade"'
				@select='year => {
					if (props.minLevel !== "decade"){
						level = nav.prevLevel()
						date = year
					}
				}'
			/>
		</section>
	</CalendarRoot>
</template>

<style lang="postcss" module>
.content {
	--calendar-cell-spacing: rem(1px);

	display: flex;
	gap: var(--spacing-sm);

	width: fit-content;
}
</style>
