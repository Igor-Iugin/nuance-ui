import type { TimePickerAmPmLabels, TimePickerFormat } from '../model'

import { splitTimeString } from './split-time-string'


export function convertTimeTo12HourFormat({
	hours,
	minutes,
	seconds,
	amPmLabels,
}: {
	hours: number | null
	minutes: number | null
	seconds: number | null
	amPmLabels: TimePickerAmPmLabels
}) {
	if (hours === null) {
		return { hours: null, minutes: null, seconds: null, amPm: null }
	}

	const amPm = hours >= 12 ? amPmLabels.pm : amPmLabels.am
	const hour12 = hours % 12 === 0 ? 12 : hours % 12

	return {
		hours: hour12,
		minutes: typeof minutes === 'number' ? minutes : null,
		seconds: typeof seconds === 'number' ? seconds : null,
		amPm,
	}
}

export function getParsedTime({ time, format, amPmLabels }: {
	time: string
	format: TimePickerFormat
	amPmLabels: TimePickerAmPmLabels
}) {
	if (time === '') {
		return { hours: null, minutes: null, seconds: null, amPm: null }
	}

	const { hours, minutes, seconds } = splitTimeString(time)

	const parsed = { hours, minutes, seconds }

	if (format === '12h') {
		return convertTimeTo12HourFormat({ ...parsed, amPmLabels })
	}

	return { ...parsed, amPm: null }
}
