import { addDay, isBefore } from '@formkit/tempo'


export function getDaysBetween(
	start: Date,
	end: Date,
): string[] {
	const days = []

	let date = start
	while (isBefore(date, end)) {
		days.push(date.toISOString())
		date = addDay(date, 1)
	}

	return days
}
