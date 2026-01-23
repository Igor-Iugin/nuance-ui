import type { DateConfig } from '#imports'

import { format as tFormat } from '@formkit/tempo'


export function getWeekdayNames({
	format,
	firstDayOfWeek,
	...config
}: {
	format: string
	firstDayOfWeek: number
} & DateConfig) {
	const baseDate = new Date(1970, 0, 4)

	return Array.from({ length: 7 }, (_, i) => tFormat({
		date: new Date(baseDate.getTime() + ((firstDayOfWeek + i) % 7) * 86400000),
		format,
		...config,
	}))
}
