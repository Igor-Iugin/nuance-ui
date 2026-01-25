<script setup lang='ts'>
import type { DateValue } from '@internationalized/date'

import { getLocalTimeZone, isSameDay, isSameMonth, isToday } from '@internationalized/date'
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import UnstyledButton from '../../../button/unstyled-button.vue'
import { useCalendarState } from '../../lib/context'


export interface CalendarCellTriggerProps extends BoxProps {
	/** The date value provided to the cell trigger */
	day: DateValue
	/** The month in which the cell is rendered */
	month: DateValue
}

const props = defineProps<CalendarCellTriggerProps>()

defineSlots<{
	default: [{
		/** Current day */
		date: string
		/** Current disable state */
		disabled: boolean
		/** Current selected state */
		selected: boolean
		/** Current today state */
		today: boolean
		/** Current outside view state */
		outsideView: boolean
		/** Current outside visible view state */
		outsideVisibleView: boolean
		/** Current unavailable state */
		unavailable: boolean
	}]
}>()

const ctx = useCalendarState()

const date = computed(() => props.day.day.toLocaleString(ctx.locale.value))
const label = computed(() => ctx.formatter.custom(fDate(props.day), {
	weekday: 'long',
	month: 'long',
	day: 'numeric',
	year: 'numeric',
}))
const unavailable = computed(() => ctx.isDateUnavailable?.(props.day) ?? false)
const today = computed(() => isToday(props.day, getLocalTimeZone()))
const outside = computed(() => isSameMonth(props.day, props.month))
const disabled = computed(() => ctx.isDateDisabled(props.day) || (ctx.hideOutsideDates.value && outside.value))
const focused = computed(() => !ctx.disabled.value && isSameDay(props.day, ctx.placeholder.value))
const selected = computed(() => ctx.isDateSelected(props.day))

function changeDate(date: DateValue) {
	if (ctx.readonly.value)
		return
	if (ctx.isDateDisabled(date) || ctx.isDateUnavailable?.(date))
		return

	ctx.onDateChange(date)
}

const onClick = () => !disabled.value && changeDate(props.day)
</script>

<template>
	<UnstyledButton
		:aria-label='label'
		data-calendar-cell-trigger
		:disabled
		:mod='{
			selected,
			value: date,
			unavailable,
			today,
			outside,
			focused,
		}'
		:tabindex='focused ? 0 : outside || disabled ? undefined : -1'
		@click='onClick'
	>
		<slot :date :disabled :today :selected :outside :unavailable>
			{{ date }}
		</slot>
	</UnstyledButton>
</template>
