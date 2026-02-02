import type { DateInput, FormatToken } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { DateMatcher } from '@nui/helpers/date'
import type { ModelRef, Ref } from 'vue'

import { range } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { computed } from 'vue'


export interface UseCalendarProps {
	numberOfMonths: Ref<number | undefined>
	weekdayFormat: Ref<FormatToken>
	fixedWeeks: Ref<boolean | undefined>
	minDate: Ref<DateInput | undefined>
	maxDate: Ref<DateInput | undefined>
	excludeDate: Ref<DateMatcher | undefined>
	highlightToday: Ref<boolean | undefined>
	hideWeekdays: Ref<boolean | undefined>
	hideOutsideDates: Ref<boolean | undefined>
	disabled: Ref<boolean | undefined>
	readonly: Ref<boolean | undefined>
	config: Ref<DateConfig | undefined>
}

type OmittedProps = Omit<UseCalendarProps, 'config'>
export interface UseCalendarReturn extends OmittedProps {
	weekdays: Ref<string[]>
	date: ModelRef<DateInput>
	config: DateConfig
}

export function useCalendar(
	date: ModelRef<DateInput>,
	{
		config: cfg,
		numberOfMonths,
		weekdayFormat,

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

	return {
		weekdays,

		// props
		disabled,
		numberOfMonths,
		hideOutsideDates: hideOutside,
		config: config.value,
		date,
		weekdayFormat,
		...props,
	}
}
