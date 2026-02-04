import type { DateInput } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'
import type { DateMatcher } from '@nui/helpers/date'
import type { ModelRef } from 'vue'

import { sameDay, weekEnd, weekStart } from '@formkit/tempo'
import { createStrictInjection } from '@nui/helpers'
import { isSameWeek } from '@nui/helpers/date'

import type { DateSelection, SelectionMode } from '../model'


export interface UseCalendarSelectionProps<T extends SelectionMode = 'single'> {
	mode: T
	value: ModelRef<DateSelection<T>>
	config: DateConfig
	readonly?: boolean
	onSelect?: (value: DateSelection<T>) => void
}

export interface UseCalendarSelectionReturn<T extends SelectionMode = 'single'> {
	mode: T
	value: ModelRef<DateSelection<T>>

	// Selection state checks
	isSelected: DateMatcher
	isInRange: DateMatcher
	isFirstInRange: DateMatcher
	isLastInRange: DateMatcher

	select: (date: DateInput) => void
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
	const isSelected: DateMatcher = date => {
		if (!value.value)
			return false

		switch (mode) {
			case 'single': {
				const val = value.value as DateSelection<'single'>
				return val ? sameDay(date, val) : false
			}
			case 'range': {
				const [start, end] = value.value as DateSelection<'range'>

				if (start || end) {
					const isStart = !!start && sameDay(date, start)
					const isEnd = !!end && sameDay(date, end)
					return isStart || isEnd
				}
				return false
			}
			case 'week': {
				const [start] = value.value as DateSelection<'week'>
				if (!start)
					return false
				return isSameWeek(date, start, config.firstDayOfWeek)
			}
			case 'multiple': {
				const val = value.value as DateSelection<'multiple'>
				return val.some(d => sameDay(d, date))
			}
			default:
				return false
		}
	}

	const isInRange: DateMatcher = date => {
		if (mode !== 'range' && mode !== 'week')
			return false

		if (mode === 'range') {
			const [start, end] = value.value as DateSelection<'range'>
			if (!start || !end)
				return false

			const startDate = new Date(start)
			const endDate = new Date(end)
			const current = new Date(date)

			return current >= startDate && current <= endDate
		}

		if (mode === 'week') {
			const [start] = value.value as DateSelection<'week'>
			if (!start)
				return false
			return isSameWeek(date, start, config.firstDayOfWeek)
		}

		return false
	}

	const isFirstInRange: DateMatcher = date => {
		if (mode === 'range' || mode === 'week') {
			const [start] = value.value as DateSelection<'range'>
			return start ? sameDay(date, start) : false
		}

		return false
	}

	const isLastInRange: DateMatcher = date => {
		if (mode === 'range' || mode === 'week') {
			const [_, end] = value.value as DateSelection<'range'>
			return end ? sameDay(date, end) : false
		}

		return false
	}

	// ===== Handlers =====
	const select = (date: DateInput): void => {
		if (readonly)
			return

		let newValue: DateSelection<T>

		switch (mode) {
			case 'single': {
				newValue = date as DateSelection<T>
				break
			}
			case 'range': {
				const [start, end] = value.value as DateSelection<'range'>
				if (!start || (start && end)) {
					// Start new range
					newValue = [date, null] as DateSelection<T>
				}
				else {
					// Complete range
					const startDate = new Date(start)
					const endDate = new Date(date)

					if (startDate <= endDate) {
						newValue = [start, date] as DateSelection<T>
					}
					else {
						// Swap if end is before start
						newValue = [date, start] as DateSelection<T>
					}
				}
				break
			}
			case 'week': {
				newValue = [
					weekStart(date, config.firstDayOfWeek),
					weekEnd(date, config.firstDayOfWeek),
				] as DateSelection<T>
				break
			}
			case 'multiple': {
				const val = (value.value as DateSelection<'multiple'>) || []
				const exists = val.findIndex(d => sameDay(d, date))

				if (exists >= 0) {
					// Remove if already selected
					newValue = val.filter((_, ix) => ix !== exists) as DateSelection<T>
				}
				else {
					// Add new date
					newValue = [...val, date] as DateSelection<T>
				}
				break
			}
			default:
				return
		}

		value.value = newValue
		onSelect?.(newValue)
	}

	const clear = (): void => {
		if (readonly)
			return

		let newValue: DateSelection<T>

		switch (mode) {
			case 'single':
				newValue = null as DateSelection<T>
				break
			case 'range':
			case 'week':
				newValue = [null, null] as DateSelection<T>
				break
			case 'multiple':
				newValue = [] as unknown as DateSelection<T>
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
		select,
		clear,
	})
}
