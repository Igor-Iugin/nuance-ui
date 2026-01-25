import type { DateInput } from '@formkit/tempo'

import { date } from '@formkit/tempo'


export function isSameMonth(dateA: DateInput, dateB: DateInput): boolean {
	const a = date(dateA)
	const b = date(dateB)
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}
