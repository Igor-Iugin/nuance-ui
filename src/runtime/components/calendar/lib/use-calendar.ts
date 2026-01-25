import type { DateInput } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { CalendarGrid, DateMatcher } from '@nui/helpers/date'
import type { ModelRef, Ref } from 'vue'

import { addMonth, isAfter, isBefore, range, sameDay } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { createMonths, isSameMonth, isWeekend as isWeekendDay } from '@nui/helpers/date'
import { ref } from 'vue'


export interface UseCalendarProps {
	weekdayFormat: Ref<string>
	nextPage: Ref<((date: DateInput) => DateInput) | undefined>
	prevPage: Ref<((date: DateInput) => DateInput) | undefined>

	date: ModelRef<DateInput>
	fixedWeeks: Ref<boolean>
	numberOfMonths: Ref<number>
	minDate: Ref<DateInput | undefined>
	maxDate: Ref<DateInput | undefined>
	disabled: Ref<boolean>

	config?: DateConfig

	isDateDisabled?: DateMatcher
}

export function useCalendar({
	date,
	config: _cfg,
	fixedWeeks,
	numberOfMonths,
	weekdayFormat,

	isDateDisabled,

	maxDate,
	minDate,
	disabled,
}: UseCalendarProps) {
	const config = _cfg ?? useDatesConfig()

	const grid = ref<CalendarGrid[]>(createMonths({
		date: date.value,
		numberOfMonths: numberOfMonths.value,
		config,
		fixedWeeks: fixedWeeks.value,
	}))
	const weekdays = range('ddd', config?.locale, config?.genitive)
	const today = new Date()

	const isWeekend = (day: DateInput) => isWeekendDay(day, config.firstDayOfWeek)
	const isOutside = (day: DateInput) => !isSameMonth(day, date.value)
	const isToday = (day: DateInput) => sameDay(day, today)

	const isDisabled = (day: DateInput) => {
		if (isDateDisabled?.(day) || disabled.value)
			return true
		if (maxDate.value && isAfter(date.value, maxDate.value))
			return true
		if (minDate.value && isBefore(date.value, minDate.value))
			return true

		return false
	}

	// ??
	const isNextDisabled = () => {
		if (!maxDate.value || !grid.value.length)
			return false
		if (disabled.value)
			return true

		const lastPeriod = grid.value[grid.value.length - 1]!.value

		return isAfter(addMonth(lastPeriod, 1), maxDate.value)
	}

	// ??
	const isPrevDisabled = () => {
		if (!minDate.value || !grid.value.length)
			return false
		if (disabled.value)
			return true

		const firstPeriod = grid.value[0]!.value

		return isBefore(addMonth(firstPeriod, -1), minDate.value)
	}

	return {
		grid,
		weekdays,

		isWeekend,
		isOutside,
		isToday,
		isDisabled,

		isNextDisabled,
		isPrevDisabled,

		// props
		fixedWeeks,
		disabled,
		numberOfMonths,
		config,
		date,
		weekdayFormat,
	}
}
