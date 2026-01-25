import type { DateInput } from '@formkit/tempo'
import type { CalendarGrid, DateMatcher } from '@nui/helpers/date'
import type { ModelRef, Ref } from 'vue'

import { createStrictInjection } from '@nui/helpers'


interface CalendarState {
	date: ModelRef<DateInput>
	pagedNavigation: Ref<boolean>
	preventDeselect: Ref<boolean>
	grid: Ref<CalendarGrid[]>
	weekDays: Ref<string[]>
	weekdayFormat: Ref<string>
	fixedWeeks: Ref<boolean>
	multiple: Ref<boolean>
	numberOfMonths: Ref<number>
	disabled: Ref<boolean>
	readonly: Ref<boolean>
	onDateChange: (date: DateInput) => void
	parentElement: Ref<HTMLElement | undefined>
	headingValue: Ref<string>
	isDateDisabled: DateMatcher
	isDateSelected: DateMatcher
	isDateUnavailable?: DateMatcher
	prevPage: (prevPageFunc?: (date: DateInput) => DateInput) => void
	nextPage: (nextPageFunc?: (date: DateInput) => DateInput) => void
	isNextButtonDisabled: (nextPageFunc?: (date: DateInput) => DateInput) => boolean
	isPrevButtonDisabled: (prevPageFunc?: (date: DateInput) => DateInput) => boolean
	dir: Ref<'rtl' | 'ltr'>
	hideOutsideDates: Ref<boolean>
	minDate: Ref<DateInput | undefined>
	maxDate: Ref<DateInput | undefined>
}

const injectionKey = Symbol('nui-calendar')
const [Provide, Inject] = createStrictInjection((state: CalendarState) => state, {
	injectionKey,
	name: 'CalendarState',
})

export const useProvideCalendarState = Provide
export const useCalendarState = Inject
