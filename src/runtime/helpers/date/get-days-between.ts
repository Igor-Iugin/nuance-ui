import type { DateInput } from '@formkit/tempo'

import { addDay, format, isBefore } from '@formkit/tempo'


export function getDaysBetween(
	start: DateInput,
	end: DateInput,
): string[] {
	const days = []

	let date = start
	while (isBefore(date, end)) {
		days.push(format(date, 'YYYY-MM-DD'))
		date = addDay(date, 1)
	}

	return days
}
