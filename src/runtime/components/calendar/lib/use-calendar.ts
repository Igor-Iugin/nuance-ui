import type { DateInput, FormatToken } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { DateMatcher } from '@nui/helpers/date'
import type { ModelRef, Ref } from 'vue'

import { addMonth, isAfter, isBefore, range } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { computed } from 'vue'


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
	| 'prevDisabled'
	| 'nextDisabled'
	| 'prevPage'
	| 'nextPage'
>
export interface UseCalendarReturn extends OmittedProps {
	weekdays: Ref<string[]>
	date: ModelRef<DateInput>
	config: DateConfig

	isNextDisabled: () => boolean
	isPrevDisabled: () => boolean
	prevPage: () => void
	nextPage: () => void
}

export function useCalendar(
	date: ModelRef<DateInput>,
	{
		config: cfg,
		numberOfMonths,
		weekdayFormat,

		nextDisabled,
		prevDisabled,

		maxDate,
		minDate,
		disabled,
		hideOutsideDates,
		...props
	}: UseCalendarProps,
): UseCalendarReturn {
	const config = computed(() => cfg.value ?? useDatesConfig())

	const hideOutside = computed(() => (numberOfMonths.value && numberOfMonths.value > 1) || hideOutsideDates.value)

	const weekdays = computed(() => {
		const days = range(weekdayFormat.value, config.value?.locale, config.value?.genitive)

		if (config.value.firstDayOfWeek === 1) {
			return [
				...days.slice(config.value.firstDayOfWeek),
				...days.slice(0, config.value.firstDayOfWeek),
			]
		}

		return days
	})

	const isNextDisabled = () => {
		if (!maxDate.value)
			return false
		if (disabled.value)
			return true
		if (nextDisabled.value?.(date.value))
			return true

		return isAfter(addMonth(date.value, 1), maxDate.value)
	}

	const isPrevDisabled = () => {
		if (!minDate.value)
			return false
		if (disabled.value)
			return true
		if (prevDisabled.value?.(date.value))
			return true

		return isBefore(addMonth(date.value, -1), minDate.value)
	}

	return {
		weekdays,

		isNextDisabled,
		isPrevDisabled,

		// props
		disabled,
		numberOfMonths,
		hideOutsideDates: hideOutside,
		config: config.value,
		date,
		weekdayFormat,
		maxDate,
		minDate,
		...props,
	}
}
