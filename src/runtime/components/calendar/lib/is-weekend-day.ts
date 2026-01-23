import type { DateInput } from '@formkit/tempo'

import { date as fDate } from '@formkit/tempo'


export function isWeekendDay(date: DateInput, firstDayOfWeek: number): boolean {
	const day = fDate(date).getDay()

	// Выходные - это последние два дня недели
	// Например, если первый день = 1 (понедельник), то выходные = 6, 0 (суббота, воскресенье)
	// Если первый день = 0 (воскресенье), то выходные = 5, 6 (пятница, суббота)

	const lastDayOfWeek = (firstDayOfWeek + 6) % 7
	const secondLastDayOfWeek = (firstDayOfWeek + 5) % 7

	return day === lastDayOfWeek || day === secondLastDayOfWeek
}
