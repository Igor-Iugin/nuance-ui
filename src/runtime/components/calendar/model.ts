import type { DateInput, FormatOptions, FormatToken } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { DateMatcher } from '@nui/helpers/date'

/**
 *  `@formkit/tempo` config
 */
export type CalendarSettings = Omit<FormatOptions, 'date'>

export interface CalendarEmits {
	(e: 'prev', date: DateInput): DateInput
	(e: 'next', date: DateInput): DateInput
}

export interface CalendarParams {
	/** The number of months to display at once */
	numberOfMonths?: number

	/** `@formkit/tempo` format for weekdays names @default `'ddd'` */
	weekdayFormat?: FormatToken

	/** Whether or not to always display 6 weeks in the calendar */
	fixedWeeks?: boolean

	/** Minimum possible date */
	minDate?: DateInput

	/** Maximum possible date */
	maxDate?: DateInput

	/** Callback function to determine whether the day should be disabled */
	excludeDate?: DateMatcher

	/** Callback function to determine whether the prev button should be disabled */
	prevDisabled?: DateMatcher

	/** Callback function to determine whether the next button should be disabled */
	nextDisabled?: DateMatcher

	/** Determines whether today should be highlighted with a border @default `false` */
	highlightToday?: boolean

	/** Determines whether weekdays row should be hidden @default `false` */
	hideWeekdays?: boolean

	/** Determines whether outside dates should be hidden @default `false` */
	hideOutsideDates?: boolean

	/** Whether the calendar is disabled */
	disabled?: boolean

	/** Whether the calendar is readonly */
	readonly?: boolean

	/** `@formkit/tempo` locale config */
	config?: DateConfig
}
