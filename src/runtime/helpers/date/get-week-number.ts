import type { DateInput } from '@formkit/tempo'

import { addDay, weekStart, yearStart } from '@formkit/tempo'


export function getWeekNumber(day: DateInput, firstDayOfWeek: number) {
	const firstDayOfYear = yearStart(day)
	const firstWeekStart = weekStart(firstDayOfYear, firstDayOfWeek)

	// Первая неделя года - это неделя, которая содержит 1 января
	// Если начало недели в прошлом году, сдвигаем на неделю вперед
	const yearFirstWeek = firstWeekStart < firstDayOfYear
		? addDay(firstWeekStart, 7)
		: firstWeekStart

	const currentWeek = weekStart(day, firstDayOfWeek)
	return Math.round((+currentWeek - +yearFirstWeek) / 604800000) + 1
}
