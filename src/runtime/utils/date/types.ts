import type { DateInput } from '@formkit/tempo'


/** Predicate that tests a single date. */
export type DateMatcher = (date: DateInput) => boolean

/** Week-by-week day grid representing a calendar month. */
export interface CalendarGrid<T = string> {
	/** Reference date identifying which month the grid represents. */
	value: DateInput
	/** Weeks of the grid, each week is an array of day cells. */
	rows: T[][]
}
