import type { DateInput } from '@formkit/tempo'
import type { DateStringValue } from '@nui/types'

import { addDay, format, isBefore, monthEnd, monthStart, weekEnd, weekStart } from '@formkit/tempo'


export function getMonthDays({ month, firstDayOfWeek = 0, consistentWeeks = false }: {
	month: DateInput
	firstDayOfWeek?: number
	consistentWeeks?: boolean
}): DateStringValue[][] {
	const startOfMonth = monthStart(month)
	const endOfMonth = monthEnd(startOfMonth)

	const weeks: DateStringValue[][] = []

	const start = weekStart(startOfMonth, firstDayOfWeek)
	const end = weekEnd(endOfMonth, firstDayOfWeek)

	let date = start
	while (isBefore(date, end)) {
		const days: DateStringValue[] = []

		for (let i = 0; i < 7; i += 1) {
			days.push(format(date, 'YYYY-MM-DD'))
			date = addDay(date, 1)
		}

		weeks.push(days)
	}

	if (consistentWeeks && weeks.length < 6) {
		const lastWeek = weeks[weeks.length - 1]!
		const lastDay = lastWeek[lastWeek.length - 1]!

		let nextDay = addDay(lastDay, 1)
		while (weeks.length < 6) {
			const days: DateStringValue[] = []

			for (let i = 0; i < 7; i += 1) {
				days.push(format(nextDay, 'YYYY-MM-DD'))
				nextDay = addDay(nextDay, 1)
			}

			weeks.push(days)
		}
	}

	return weeks
}
