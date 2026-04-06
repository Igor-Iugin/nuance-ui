import type { FormatOptions } from '@formkit/tempo'

import type { CalendarHeaderEmits } from './ui/core'

/** `@formkit/tempo` format options without the `date` field */
export type CalendarSettings = Omit<FormatOptions, 'date'>

/** Calendar drill-down level */
export type CalendarLevel = 'month' | 'year' | 'decade'

/** Date selection mode */
export type SelectionMode = 'single' | 'range' | 'week' | 'multiple'

/** ISO string value */
export type Selection = string | null

/** Selected value shape based on the selection mode */
export type DateSelection<T extends SelectionMode = 'single'>
	= T extends 'single' ? Selection
		: T extends 'range' ? [Selection, Selection]
			: T extends 'week' ? [Selection, Selection]
				: T extends 'multiple' ? Selection[] : never


export interface CalendarEmits<T extends SelectionMode = 'single'> extends CalendarHeaderEmits {
	select: [date: DateSelection<T>]
}
