import type { DateInput } from '@formkit/tempo'

import { weekEnd, weekStart } from '@formkit/tempo'

/**
 * Check if two dates are in the same week
 */
export function isSameWeek(date1: DateInput, date2: DateInput, firstDayOfWeek: number = 1): boolean {
	const start1 = weekStart(date1, firstDayOfWeek)
	const end1 = weekEnd(date1, firstDayOfWeek)
	const d2 = new Date(date2)

	return d2 >= start1 && d2 <= end1
}
