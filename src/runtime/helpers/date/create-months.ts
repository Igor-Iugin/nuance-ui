import type { DateInput } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'

import { addDay, monthEnd, monthStart, weekEnd, weekStart } from '@formkit/tempo'
import { chunk } from '@nui/utils'

import { getDaysBetween } from './get-days-between'


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
