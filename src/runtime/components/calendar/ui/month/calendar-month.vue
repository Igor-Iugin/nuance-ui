<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { DateStringValue, NuanceSize } from '@nui/types'

import { format, isAfter, isBefore } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'
import { getMonthDays } from '../../lib/get-month-days'
import { getWeekNumber } from '../../lib/get-week-number'
import { getWeekdayNames } from '../../lib/get-weekday-names'
import { isSameMonth } from '../../lib/is-same-month'
import { isWeekendDay } from '../../lib/is-weekend-day'
import CalendarDay from '../calendar-day.vue'


export interface CalendarMonthProps extends BoxProps {
	date: DateInput

	/** `@formkit/tempo` format for weekdays names @default `'ddd'` */
	weekdayFormat?: string

	/** Minimum possible date */
	minDate?: DateStringValue

	/** Maximum possible date */
	maxDate?: DateStringValue

	/** Determines whether outside dates should be hidden @default `false` */
	hideOutsideDates?: boolean

	/** Determines whether weekdays row should be hidden @default `false` */
	hideWeekdays?: boolean

	/** Controls size */
	size?: NuanceSize

	/** Determines whether controls should be separated by space @default `true` */
	withCellSpacing?: boolean

	/** Determines whether today should be highlighted with a border @default `false` */
	highlightToday?: boolean

	/** Determines whether week numbers should be displayed @default `false` */
	withWeekNumbers?: boolean

	/** Determines whether days should be static, static days can be used to display month if it is not expected that user will interact with the component in any way  */
	static?: boolean

	/** Callback function to determine whether the day should be disabled */
	excludeDate?: (date: string) => boolean

	/** `@formkit/tempo` locale config */
	config?: DateConfig
}

const {
	date,
	mod,
	size,
	maxDate,
	minDate,
	excludeDate,
	hideWeekdays,
	highlightToday,
	withWeekNumbers,
	static: isStatic,
	weekdayFormat = 'ddd',
	withCellSpacing = true,
	hideOutsideDates = false,
	config,
} = defineProps<CalendarMonthProps>()

const cfg = config ?? useDatesConfig()

const weeks = computed(() => getMonthDays({
	month: date,
	firstDayOfWeek: cfg.firstDayOfWeek,
}))

const weekNames = computed(() => getWeekdayNames({
	...cfg,
	format: weekdayFormat,
}))

const style = computed(() => ({
	'--wn-size': getSize(size, 'wn-size'),
}))
</script>

<template>
	<Box is='table' :class='$style.month' :mod>
		<thead v-if='!hideWeekdays'>
			<tr>
				<td v-if='withWeekNumbers' :class='$style.weekday'>
					#
				</td>
				<td v-for='name in weekNames' :key='name' :class='$style.weekday'>
					{{ name }}
				</td>
			</tr>
		</thead>
		<tbody>
			<tr v-for='(week, ix) in weeks' :key='ix'>
				<td v-if='withWeekNumbers' :style :class='$style.number'>
					{{ getWeekNumber(week[0]!, cfg.firstDayOfWeek) }}
				</td>
				<Box
					is='td'
					v-for='day in week'
					:key='day'
					:mod='{ "with-spacing": withCellSpacing }'
					:class='$style.cell'
				>
					<CalendarDay
						:is='isStatic ? "div" : undefined'
						:date='day'
						:weekend='isWeekendDay(day, cfg.firstDayOfWeek)'
						:outside='!isSameMonth(day, date)'
						:hidden='hideOutsideDates ? !isSameMonth(day, date) : false'
						:aria-label='format(day, "D MMMM YYYY")'
						:highlight-today
						:disabled='
							excludeDate?.(day)
								|| (!!maxDate && !isBefore(maxDate, day))
								|| (!!minDate && !isAfter(minDate, day))'
						:size
					>
						<slot
							name='day'
							:date='day'
							:weekend='isWeekendDay(day, cfg.firstDayOfWeek)'
							:outside='!isSameMonth(day, date)'
						/>
					</CalendarDay>
				</Box>
			</tr>
		</tbody>
	</Box>
</template>

<style lang="postcss" module>
.month {
  border-collapse: collapse;
  table-layout: fixed;
}

.cell {
  padding: 0;

  &:where([data-with-spacing]) {
    padding: .5px;
  }
}

.number {
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
  color: var(--wd-text, var(--color-dimmed));
  font-weight: normal;
  font-size: var(--font-size-sm);
  text-transform: capitalize;
  padding-bottom: calc(var(--wd-padding, var(--spacing-sm)) / 2);
  text-align: center;
}
</style>
