import type { DateInput } from '@formkit/tempo'

import { addDay, weekStart, yearStart } from '@formkit/tempo'
import { round } from 'es-toolkit'


export function getWeekNumber(day: DateInput, firstDayOfWeek: number) {
	const firstDayOfYear = yearStart(day)
	const firstWeekStart = weekStart(firstDayOfYear, firstDayOfWeek)

	// First week of the year is the one containing January 1st.
	// If the week starts in the previous year, shift it forward by a week.
	const yearFirstWeek = firstWeekStart < firstDayOfYear
		? addDay(firstWeekStart, 7)
		: firstWeekStart

	const currentWeek = weekStart(day, firstDayOfWeek)
	return round((+currentWeek - +yearFirstWeek) / 604800000) + 1
}
