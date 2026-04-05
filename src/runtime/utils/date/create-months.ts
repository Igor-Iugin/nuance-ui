import type { DateInput } from '@formkit/tempo'
import type { DateConfig } from '@nui/composables'

import { addDay, monthEnd, monthStart, weekEnd, weekStart } from '@formkit/tempo'
import { chunk } from 'es-toolkit'

import { getDaysBetween } from './get-days-between'


/**
 * Builds the week-by-week day grid for a calendar month.
 *
 * Leading and trailing days from adjacent months are included so that every
 * row has a full week.
 *
 * When `fixedWeeks` is `true`, the grid is padded to 6
 * rows (42 days) so the layout height stays stable across months.
 */
export function createMonth(date: DateInput,	config: DateConfig, fixedWeeks?: boolean): string[][] {
	const startOfMonth = monthStart(date)
	const endOfMonth = monthEnd(date)

	const start = weekStart(startOfMonth, config.firstDayOfWeek)
	const end = weekEnd(endOfMonth, config.firstDayOfWeek)

	const days = getDaysBetween(start, end)

	if (fixedWeeks && days.length < 42) {
		const extraDaysCount = 42 - days.length
		const startFrom = new Date(days[days.length - 1]!)

		const extraDays = getDaysBetween(startFrom, addDay(startFrom, extraDaysCount))

		days.push(...extraDays)
	}

	return chunk(days, 7)
}
