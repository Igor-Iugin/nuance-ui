import type { FormatOptions } from '@formkit/tempo'

/**
 *  `@formkit/tempo` config
 */
export type CalendarSettings = Omit<FormatOptions, 'date'>
export type CalendarLevel = 'month' | 'year' | 'decade'

export type SelectionMode = 'single' | 'range' | 'week' | 'multiple'

/** ISO string value */
export type Selection = string | null
export type DateSelection<T extends SelectionMode = 'single'>
	= T extends 'single' ? Selection
		: T extends 'range' ? [Selection, Selection]
			: T extends 'week' ? [Selection, Selection]
				: T extends 'multiple' ? Selection[] : never
