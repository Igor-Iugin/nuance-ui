import type { DateInput } from '@formkit/tempo'


export type DateMatcher = (date: DateInput) => boolean

export interface CalendarGrid<T = string> {
	/**
	 * A `DateInput` used to represent the month. Since days
	 * from the previous and next months may be included in the
	 * calendar grid, we need a source of truth for the value
	 * the grid is representing.
	 */
	value: DateInput

	/**
	 * An array of arrays representing the weeks in the calendar.
	 * Each sub-array represents a week, and contains the dates for each
	 * day in that week. This structure is useful for rendering the calendar
	 * grid using a table, where each row represents a week and each cell
	 * represents a day.
	 */
	rows: T[][]
}
