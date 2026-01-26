<script setup lang='ts'>
import type { DateInput } from '@formkit/tempo'

import { format } from '@formkit/tempo'
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import UnstyledButton from '../../../button/unstyled-button.vue'
import { useCalendarState } from '../../lib/context'


export interface CalendarCellTriggerProps extends BoxProps {
	/** The date value provided to the cell trigger */
	day: DateInput
	/** The month in which the cell is rendered */
	month: DateInput
}

const props = defineProps<CalendarCellTriggerProps>()

defineSlots<{
	default: [{
		/** Current day */
		date: string
		label: string
		/** Current disable state */
		disabled: boolean
		/** Current selected state */
		selected: boolean
		/** Current today state */
		today: boolean
		/** Current outside view state */
		outside: boolean
		/** Current weekend view state */
		weekend: boolean
	}]
}>()

const ctx = useCalendarState()

const label = computed(() => format({ date: props.day, format: 'D', ...ctx.config }))
const today = computed(() => ctx.isToday(props.day))
const outside = computed(() => ctx.isToday(props.day))
const disabled = computed(() => ctx.isDisabled(props.day) || (ctx.hideOutsideDates.value && outside.value))
const weekend = computed(() => ctx.isWeekend(props.day))

function changeDate(date: DateInput) {
	if (ctx.readonly.value)
		return
	if (disabled.value)
		return

	return console.log(date)
	// ctx.onDateChange(date)
}

const onClick = () => !disabled.value && changeDate(props.day)
</script>

<template>
	<UnstyledButton
		:aria-label='label'
		data-calendar-cell-trigger
		:disabled
		:mod='{
			value: props.day,
			weekend,
			today,
			outside,
		}'
		:tabindex='outside || disabled ? undefined : -1'
		@click='onClick'
	>
		<slot :date='props.day' :label :disabled :today :weekend :outside>
			{{ label }}
		</slot>
	</UnstyledButton>
</template>
