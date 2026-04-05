import type { DateInput } from '@formkit/tempo'

import { date as fDate } from '@formkit/tempo'


/**
 * Returns `true` when the date falls on a weekend.
 */
export function isWeekend(date: DateInput, firstDayOfWeek: number): boolean {
	const day = fDate(date).getDay()

	const lastDayOfWeek = (firstDayOfWeek + 6) % 7
	const secondLastDayOfWeek = (firstDayOfWeek + 5) % 7

	return day === lastDayOfWeek || day === secondLastDayOfWeek
}
