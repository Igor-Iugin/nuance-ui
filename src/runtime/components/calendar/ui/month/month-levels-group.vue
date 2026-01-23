<script setup lang="ts">
import type { DateInput } from '@formkit/tempo'

import { addMonth } from '@formkit/tempo'
import { computed } from 'vue'

import type { CalendarHeaderEmits } from '../calendar-header.vue'
import type { MonthLevelProps } from './month-level.vue'

import Box from '../../../box.vue'
import MonthLevel from './month-level.vue'


type OmittedMonthLevelProps = Omit<MonthLevelProps, 'levelControlAriaLabel' | 'date'>

export interface MonthLevelsGroupProps extends OmittedMonthLevelProps {
	/** Number of columns to display next to each other */
	numberOfColumns?: number

	/** Function that returns level control `aria-label` based on month date */
	levelControlAriaLabel?: ((month: DateInput) => string) | string
}

const {
	is,
	mod,
	levelControlAriaLabel,
	numberOfColumns = 1,
	...props
} = defineProps<MonthLevelsGroupProps>()

defineEmits<CalendarHeaderEmits>()

const date = defineModel<DateInput>('date', { required: true })

const months = computed(() => Array.from({ length: numberOfColumns }).map((_, ix) => addMonth(date.value, ix)))
</script>

<template>
	<Box :is :mod :class='$style.group'>
		<MonthLevel
			v-for='(month, ix) in months'
			v-bind='props'
			:key='ix'
			:date='month'
			:with-next='ix === numberOfColumns - 1'
			:with-prev='ix === 0'
			:level-control-aria-label='
				typeof levelControlAriaLabel === "function"
					? levelControlAriaLabel(month)
					: levelControlAriaLabel
			'
			@next='$emit("next")'
			@prev='$emit("prev")'
			@level='$emit("level")'
		>
			<template v-if='!!$slots.day' #day='{ date: day, outside, weekend }'>
				<slot name='day' :date='day' :outside :weekend />
			</template>
		</MonthLevel>
	</Box>
</template>

<style lang="postcss" module>
.group {
	display: flex;
	gap: var(--spacing-sm);
}
</style>
