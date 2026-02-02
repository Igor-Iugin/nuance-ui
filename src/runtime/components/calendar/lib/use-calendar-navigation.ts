import type { DateInput } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { ModelRef } from 'vue'

import { addMonth, addYear, date as fDate, format, isAfter, isBefore, sameYear } from '@formkit/tempo'
import { isSameMonth } from '@nui/helpers/date'
import { computed } from 'vue'

import type { CalendarLevel } from '../model'


const LEVEL_ORDER: CalendarLevel[] = ['month', 'year', 'decade']

export function useCalendarNavigation({
	date,
	level,
	numberOfMonths,
	disabled,
	minDate,
	maxDate,
	prevDisabled,
	nextDisabled,
	minLevel,
	maxLevel,
}: {
	date: ModelRef<DateInput>
	level: ModelRef<CalendarLevel>
	numberOfMonths: number
	disabled: boolean
	minLevel: CalendarLevel
	maxLevel: CalendarLevel
	minDate?: DateInput
	maxDate?: DateInput
	prevDisabled?: (date: DateInput, level: CalendarLevel) => boolean
	nextDisabled?: (date: DateInput, level: CalendarLevel) => boolean
}) {
	const calendars = computed(() => {
		const dates: string[] = []

		for (let ix = 0; ix < numberOfMonths; ix++) {
			switch (level.value) {
				case 'month':
					dates.push(addMonth(date.value, ix).toISOString())
					break
				case 'year':
					dates.push(addYear(date.value, ix).toISOString())
					break
				case 'decade':
					dates.push(addYear(date.value, ix * 10).toISOString())
					break
			}
		}

		return dates
	})


	function getLevelLabel(date: DateInput, config?: DateConfig) {
		switch (level.value) {
			case 'month':
				return format({ date, format: 'MMMM YYYY', ...config })
			case 'year':
				return fDate(date).getFullYear()
			case 'decade':
				return `${fDate(date).getFullYear()} - ${addYear(date, 9).getFullYear()}`
		}
	}

	function changeLevel(direction: 1 | -1): CalendarLevel {
		const currentIndex = LEVEL_ORDER.indexOf(level.value)
		const minIndex = LEVEL_ORDER.indexOf(minLevel)
		const maxIndex = LEVEL_ORDER.indexOf(maxLevel)
		const newIndex = currentIndex + direction

		if (newIndex < minIndex || newIndex > maxIndex)
			return LEVEL_ORDER[currentIndex]!

		return LEVEL_ORDER[newIndex] ?? LEVEL_ORDER[currentIndex]!
	}


	function move(dir: -1 | 1) {
		switch (level.value) {
			case 'month':
				return date.value = addMonth(date.value, numberOfMonths * dir)
			case 'year':
				return date.value = addYear(date.value, numberOfMonths * dir)
			case 'decade':
				return date.value = addYear(date.value, numberOfMonths * (dir * 10))
		}
	}


	function isPrevDisabled() {
		if (disabled)
			return true
		if (prevDisabled?.(calendars.value[0]!, level.value))
			return true
		if (!minDate)
			return false

		const step = numberOfMonths

		switch (level.value) {
			case 'month': {
				for (let ix = 1; ix <= step; ix++) {
					const month = addMonth(date.value, -ix)
					if (!isBefore(month, minDate) || isSameMonth(month, minDate))
						return false
				}
				return true
			}
			case 'year': {
				for (let ix = 1; ix <= step; ix++) {
					const year = addYear(date.value, -ix)
					if (!isBefore(year, minDate) || sameYear(year, minDate))
						return false
				}
				return true
			}
			case 'decade': {
				for (let ix = 1; ix <= step; ix++) {
					const decade = addYear(date.value, -ix * 10)
					if (!isBefore(decade, minDate))
						return false
				}
				return true
			}
			default:
				return false
		}
	}

	function isNextDisabled() {
		if (disabled)
			return true

		const lastCalendar = calendars.value[calendars.value.length - 1]!
		if (nextDisabled?.(lastCalendar, level.value))
			return true
		if (!maxDate)
			return false

		const step = numberOfMonths

		switch (level.value) {
			case 'month': {
				for (let ix = 1; ix <= step; ix++) {
					const month = addMonth(date.value, step - 1 + ix)
					if (!isAfter(month, maxDate) || isSameMonth(month, maxDate))
						return false
				}
				return true
			}
			case 'year': {
				for (let ix = 1; ix <= step; ix++) {
					const year = addYear(date.value, step - 1 + ix)
					if (!isAfter(year, maxDate) || sameYear(year, maxDate))
						return false
				}
				return true
			}
			case 'decade': {
				for (let ix = 1; ix <= step; ix++) {
					const decade = addYear(date.value, (step - 1 + ix) * 10)
					if (!isAfter(decade, maxDate))
						return false
				}
				return true
			}
			default:
				return false
		}
	}

	return [
		calendars,
		{
			isNextDisabled,
			isPrevDisabled,
			move,
			getLevelLabel,
			nextLevel: () => changeLevel(1),
			prevLevel: () => changeLevel(-1),
		},
	] as const
}
