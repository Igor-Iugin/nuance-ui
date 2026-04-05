import { addDay, isBefore } from '@formkit/tempo'


export function getDaysBetween(
	start: Date,
	end: Date,
): string[] {
	const days = []

	let date = start
	while (isBefore(date, end)) {
		const year = date.getFullYear()
		const month = `${date.getMonth() + 1}`.padStart(2, '0')
		const day = `${date.getDate()}`.padStart(2, '0')
		days.push(`${year}-${month}-${day}`)
		date = addDay(date, 1)
	}

	return days
}
