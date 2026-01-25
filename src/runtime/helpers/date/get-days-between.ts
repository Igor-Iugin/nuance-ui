import type { DateInput } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'

import { addDay, format, isBefore } from '@formkit/tempo'


export function getDaysBetween(
	start: DateInput,
	end: DateInput,
	config: DateConfig,
): string[] {
	const days = []

	let date = start
	while (isBefore(date, end)) {
		days.push(format(date, 'medium', config?.locale, config?.genitive))
		date = addDay(date, 1)
	}

	return days
}
