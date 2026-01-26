import type { DateInput, FormatToken } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { CalendarGrid, DateMatcher } from '@nui/helpers/date'
import type { ModelRef, Ref } from 'vue'

import { addMonth, isAfter, isBefore, range, sameDay } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { createMonths, isSameMonth, isWeekend as isWeekendDay } from '@nui/helpers/date'
import { computed, ref, watch } from 'vue'


export interface UseCalendarProps {
	prevPage: () => void
	nextPage: () => void

	// props
	numberOfMonths: Ref<number | undefined>
	weekdayFormat: Ref<FormatToken>
	fixedWeeks: Ref<boolean | undefined>
	minDate: Ref<DateInput | undefined>
	maxDate: Ref<DateInput | undefined>
	excludeDate: Ref<DateMatcher | undefined>
	prevDisabled: Ref<DateMatcher | undefined>
	nextDisabled: Ref<DateMatcher | undefined>
	highlightToday: Ref<boolean | undefined>
	hideWeekdays: Ref<boolean | undefined>
	hideOutsideDates: Ref<boolean | undefined>
	disabled: Ref<boolean | undefined>
	readonly: Ref<boolean | undefined>
	config: Ref<DateConfig | undefined>
}

type OmittedProps = Omit<
	UseCalendarProps,
	| 'config'
	| 'minDate'
	| 'maxDate'
	| 'excludeDate'
	| 'prevDisabled'
	| 'nextDisabled'
	| 'prevPage'
	| 'nextPage'
>
export interface UseCalendarReturn extends OmittedProps {
	isWeekend: DateMatcher
	isOutside: DateMatcher
	isToday: DateMatcher
	isDisabled: DateMatcher
	isNextDisabled: () => boolean
	isPrevDisabled: () => boolean
	prevPage: () => void
	nextPage: () => void
	grid: Ref<CalendarGrid[]>
	weekdays: Ref<string[]>
	date: ModelRef<DateInput>
	config: DateConfig
}

export function useCalendar(
	date: ModelRef<DateInput>,
	{
		config: cfg,
		fixedWeeks,
		numberOfMonths,
		weekdayFormat,

		excludeDate,
		nextDisabled,
		prevDisabled,

		prevPage,
		nextPage,

		maxDate,
		minDate,
		disabled,
		...props
	}: UseCalendarProps,
): UseCalendarReturn {
	const config = cfg.value ?? useDatesConfig()

	const grid = ref<CalendarGrid[]>(createMonths({
		date: date.value,
		numberOfMonths: numberOfMonths.value,
		config,
		fixedWeeks: fixedWeeks.value,
	}))

	const weekdays = computed(() => {
		const days = range(weekdayFormat.value, config?.locale, config?.genitive)

		if (config.firstDayOfWeek === 1)
			return [...days.slice(config.firstDayOfWeek), ...days.slice(0, config.firstDayOfWeek)]

		return days
	})
	const today = new Date()

	watch([date, numberOfMonths, () => config, fixedWeeks], ([date, numberOfMonths, config, fixedWeeks]) => {
		grid.value = createMonths({
			date,
			numberOfMonths,
			config,
			fixedWeeks,
		})
	})

	const isWeekend = (day: DateInput) => isWeekendDay(day, config.firstDayOfWeek)
	const isOutside = (day: DateInput) => !isSameMonth(day, date.value)
	const isToday = (day: DateInput) => sameDay(day, today)

	const isDisabled = (day: DateInput) => {
		if (excludeDate?.value?.(day) || disabled.value)
			return true
		if (maxDate.value && isAfter(date.value, maxDate.value))
			return true
		if (minDate.value && isBefore(date.value, minDate.value))
			return true

		return false
	}

	const isNextDisabled = () => {
		if (!maxDate.value || !grid.value.length)
			return false
		if (disabled.value)
			return true
		if (nextDisabled.value?.(date.value))
			return true

		return isAfter(addMonth(date.value, 1), maxDate.value)
	}

	const isPrevDisabled = () => {
		if (!minDate.value || !grid.value.length)
			return false
		if (disabled.value)
			return true
		if (prevDisabled.value?.(date.value))
			return true

		return isBefore(addMonth(date.value, -1), minDate.value)
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
		prevPage,
		nextPage,

		// props
		fixedWeeks,
		disabled,
		numberOfMonths,
		config,
		date,
		weekdayFormat,
		...props,
	}
}
