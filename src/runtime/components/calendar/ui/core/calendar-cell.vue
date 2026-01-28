<script setup lang='ts'>
import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'


export interface CalendarCellProps extends BoxProps {
}

const { is = 'td', mod } = defineProps<CalendarCellProps>()
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
	<Box :is :mod role='gridcell'>
		<slot />
	</Box>
</template>
