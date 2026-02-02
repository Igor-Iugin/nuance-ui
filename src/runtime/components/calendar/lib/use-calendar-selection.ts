import type { DateInput } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { ModelRef } from 'vue'

import { sameDay, weekEnd, weekStart } from '@formkit/tempo'
import { createStrictInjection } from '@nui/helpers'
import { getWeekNumber, isSameWeek } from '@nui/helpers/date'

import type { CalendarSelection, MultipleSelection, RangeSelection, SelectionMode, SingleSelection, WeekSelection } from '../model'


export interface UseCalendarSelectionProps<T extends SelectionMode = 'single'> {
	mode: T
	value: ModelRef<CalendarSelection<T>>
	config: DateConfig
	readonly?: boolean
	onSelect?: (value: CalendarSelection<T>) => void
}

export interface UseCalendarSelectionReturn<T extends SelectionMode = 'single'> {
	mode: T
	value: ModelRef<CalendarSelection<T>>

	// Selection state checks
	isSelected: (date: DateInput) => boolean
	isInRange: (date: DateInput) => boolean
	isFirstInRange: (date: DateInput) => boolean
	isLastInRange: (date: DateInput) => boolean

	// Selection handlers
	handleDaySelect: (date: DateInput) => void
	handleMonthSelect: (date: DateInput) => void
	handleYearSelect: (date: DateInput) => void

	// Helpers
	clear: () => void
}


const injectionKey = Symbol('nui-calendar-select')
const [Provide, Inject] = createStrictInjection((state: UseCalendarSelectionReturn) => state, {
	injectionKey,
	name: 'CalendarSelectState',
})

const useProvideCalendarState = Provide as <T extends SelectionMode>(
	state: UseCalendarSelectionReturn<T>,
) => UseCalendarSelectionReturn<T>
export const useCalendarSelectionState = Inject as <T extends SelectionMode>() => UseCalendarSelectionReturn<T>


export function useCalendarSelection<T extends SelectionMode = 'single'>({
	mode,
	value,
	config,
	readonly,
	onSelect,
}: UseCalendarSelectionProps<T>): UseCalendarSelectionReturn<T> {
	// ===== Selection State Checks =====
	const isSelected = (date: DateInput): boolean => {
		if (!value.value)
			return false

		switch (mode) {
			case 'single': {
				const val = value.value as SingleSelection
				return val ? sameDay(date, val) : false
			}
			case 'range': {
				const val = value.value as RangeSelection
				if (!val.start && !val.end)
					return false
				if (val.start && val.end) {
					return sameDay(date, val.start) || sameDay(date, val.end)
				}
				if (val.start)
					return sameDay(date, val.start)
				return false
			}
			case 'week': {
				const val = value.value as WeekSelection
				if (!val.start)
					return false
				return isSameWeek(date, val.start, config.firstDayOfWeek)
			}
			case 'multiple': {
				const val = value.value as MultipleSelection
				return val.some(d => sameDay(d, date))
			}
			default:
				return false
		}
	}

	const isInRange = (date: DateInput): boolean => {
		if (mode !== 'range' && mode !== 'week')
			return false

		if (mode === 'range') {
			const val = value.value as RangeSelection
			if (!val.start || !val.end)
				return false

			const startDate = new Date(val.start)
			const endDate = new Date(val.end)
			const current = new Date(date)

			return current >= startDate && current <= endDate
		}

		if (mode === 'week') {
			const val = value.value as WeekSelection
			if (!val.start)
				return false
			return isSameWeek(date, val.start, config.firstDayOfWeek)
		}

		return false
	}

	const isFirstInRange = (date: DateInput): boolean => {
		if (mode === 'range') {
			const val = value.value as RangeSelection
			return val.start ? sameDay(date, val.start) : false
		}

		if (mode === 'week') {
			const val = value.value as WeekSelection
			if (!val.start)
				return false
			return sameDay(date, val.start)
		}

		return false
	}

	const isLastInRange = (date: DateInput): boolean => {
		if (mode === 'range') {
			const val = value.value as RangeSelection
			return val.end ? sameDay(date, val.end) : false
		}

		if (mode === 'week') {
			const val = value.value as WeekSelection
			if (!val.end)
				return false
			return sameDay(date, val.end)
		}

		return false
	}

	// ===== Selection Handlers =====

	const handleDaySelect = (date: DateInput): void => {
		if (readonly)
			return

		let newValue: CalendarSelection<T>

		switch (mode) {
			case 'single': {
				newValue = date as CalendarSelection<T>
				break
			}
			case 'range': {
				const val = value.value as RangeSelection
				if (!val.start || (val.start && val.end)) {
					// Start new range
					newValue = { start: date, end: null } as CalendarSelection<T>
				}
				else {
					// Complete range
					const start = new Date(val.start)
					const end = new Date(date)

					if (start <= end) {
						newValue = { start: val.start, end: date } as CalendarSelection<T>
					}
					else {
						// Swap if end is before start
						newValue = { start: date, end: val.start } as CalendarSelection<T>
					}
				}
				break
			}
			case 'week': {
				newValue = {
					start: weekStart(date, config.firstDayOfWeek),
					end: weekEnd(date, config.firstDayOfWeek),
					number: getWeekNumber(date, config.firstDayOfWeek),
				} as CalendarSelection<T>
				break
			}
			case 'multiple': {
				const val = (value.value as MultipleSelection) || []
				const exists = val.findIndex(d => sameDay(d, date))

				if (exists >= 0) {
					// Remove if already selected
					newValue = val.filter((_, ix) => ix !== exists) as CalendarSelection<T>
				}
				else {
					// Add new date
					newValue = [...val, date] as CalendarSelection<T>
				}
				break
			}
			default:
				return
		}

		value.value = newValue
		onSelect?.(newValue)
	}

	const handleMonthSelect = (date: DateInput): void => {
		if (readonly)
			return

		// When selecting a month in year view, use the first day of selected month
		const firstDayOfMonth = new Date(date)
		firstDayOfMonth.setDate(1)

		handleDaySelect(firstDayOfMonth)
	}

	const handleYearSelect = (date: DateInput): void => {
		if (readonly)
			return

		// When selecting a year in decade view, use January 1st of selected year
		const firstDayOfYear = new Date(date)
		firstDayOfYear.setMonth(0, 1)

		handleDaySelect(firstDayOfYear)
	}

	const clear = (): void => {
		if (readonly)
			return

		let newValue: CalendarSelection<T>

		switch (mode) {
			case 'single':
				newValue = null as CalendarSelection<T>
				break
			case 'range':
				newValue = { start: null, end: null } as CalendarSelection<T>
				break
			case 'week':
				newValue = { start: null, end: null, number: null } as CalendarSelection<T>
				break
			case 'multiple':
				newValue = [] as unknown as CalendarSelection<T>
				break
			default:
				return
		}

		value.value = newValue
		onSelect?.(newValue)
	}

	return useProvideCalendarState({
		mode,
		value,
		isSelected,
		isInRange,
		isFirstInRange,
		isLastInRange,
		handleDaySelect,
		handleMonthSelect,
		handleYearSelect,
		clear,
	})
}
