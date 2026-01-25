<script setup lang='ts'>
import type { DateValue } from '@internationalized/date'

import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'
import { useCalendarState } from '../../lib/context'


export interface CalendarCellProps extends BoxProps {
	date: DateValue
}

const { is,	mod, date } = defineProps<CalendarCellProps>()
const ctx = useCalendarState()
/**
 * Отличие reka-ui от моего решения в том, что как пропс передаётся только date
 * тем самым ререндеры уменьшаются до изменения этого date.
 *
 * Остальные расчётные значения беруться из контекста ВНУТРИ компонента
 * тем самым уменьшается нагрузка при изменении пропсов
 *
 * Дополнительно разделяется состояние для ячейки и кнопки в ней
 */
</script>

<template>
	<Box
		:is
		:mod
		role='gridcell'
		:aria-selected='ctx.isDateSelected(date) ? true : undefined'
		:aria-disabled='ctx.isDateDisabled(date) || ctx.isDateUnavailable?.(date) || ctx.hideOutsideDates.value'
		:data-disabled="ctx.isDateDisabled(date) || ctx.hideOutsideDates.value ? '' : undefined"
	>
		<slot />
	</Box>
</template>
