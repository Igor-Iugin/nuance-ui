import type { DateInput, FormatOptions } from '@formkit/tempo'

/**
 *  `@formkit/tempo` config
 */
export type CalendarSettings = Omit<FormatOptions, 'date'>
export type CalendarLevel = 'month' | 'year' | 'decade'


/**
 * Single date selection
 */
export type SingleSelection = DateInput | null

/**
 * Range selection with start and end dates
 */
export interface RangeSelection {
	start: DateInput | null
	end: DateInput | null
}

/**
 * Week selection with start date
 */
export interface WeekSelection {
	start: DateInput | null
	end: DateInput | null
	number: number | null
}

/**
 * Multiple dates selection
 */
export type MultipleSelection = DateInput[]

export type SelectionMode = 'single' | 'range' | 'week' | 'multiple'
export type CalendarSelection<T extends SelectionMode>
	= T extends 'single' ? SingleSelection
		: T extends 'range' ? RangeSelection
			: T extends 'week' ? WeekSelection
				: T extends 'multiple' ? MultipleSelection : never
