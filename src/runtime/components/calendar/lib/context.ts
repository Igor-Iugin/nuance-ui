import type { DateInput, FormatToken } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { DateMatcher } from '@nui/helpers/date'
import type { ModelRef, Ref } from 'vue'

import { createStrictInjection } from '@nui/helpers'


interface State {
	date: ModelRef<DateInput>
	hideOutsideDates: Ref<boolean>
	weekdays: Ref<string[]>
	config: DateConfig
	weekdayFormat?: FormatToken
	fixedWeeks?: boolean
	minDate?: DateInput
	maxDate?: DateInput
	disabled?: boolean
	readonly?: boolean
	highlightToday?: boolean
	excludeDate?: DateMatcher
}

const injectionKey = Symbol('nui-calendar')
const [Provide, Inject] = createStrictInjection((state: State) => state, {
	injectionKey,
	name: 'CalendarState',
})

export const useProvideCalendarState = Provide
export const useCalendarState = Inject
