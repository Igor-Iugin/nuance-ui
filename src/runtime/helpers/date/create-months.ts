import type { DateInput } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'

import { addDay, addMonth, format, monthEnd, monthStart, weekEnd, weekStart } from '@formkit/tempo'
import { chunk } from '@nui/utils'

import type { CalendarGrid } from './types'

import { getDaysBetween } from './get-days-between'


interface CreateMonthProps {
	date: DateInput
	fixedWeeks?: boolean
	config: DateConfig
}

function createMonth({ date, fixedWeeks, config }: CreateMonthProps): CalendarGrid {
	const startOfMonth = monthStart(date)
	const endOfMonth = monthEnd(date)

	const start = weekStart(startOfMonth, config.firstDayOfWeek)
	const end = weekEnd(endOfMonth, config.firstDayOfWeek)

	const days = getDaysBetween(start, end, config)

	if (fixedWeeks && days.length < 42) {
		const extraDays = 42 - days.length
		const startFrom = days[days.length - 1]

		for (let i = 1; i < extraDays; i++) {
			days.push(format(addDay(startFrom, i), 'YYYY-MM-DD', config?.locale, config?.genitive))
		}
	}

	const weeks = chunk(days, 7)

	return {
		value: date,
		rows: weeks,
		cells: days,
	}
}

interface CreateMonthsProps extends CreateMonthProps {
	numberOfMonths: number | undefined
}

export function createMonths({ numberOfMonths, ...props }: CreateMonthsProps): CalendarGrid[] {
	const months = []

	if (!numberOfMonths || numberOfMonths === 1) {
		months.push(createMonth(props))
		return months
	}

	for (let i = 0; i < numberOfMonths; i++) {
		months.push(createMonth({ ...props, date: addMonth(props.date, i) }))
	}

	return months
}
