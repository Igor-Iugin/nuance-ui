<script setup lang="ts">
import type { DateValue } from '@internationalized/date'

import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import UnstyledButton from '../../../button/unstyled-button.vue'
import { useCalendarState } from '../../lib/context'


export interface CalendarNextProps extends BoxProps {
	/** The function to be used for the next page. Overwrites the `nextPage` function set on the `CalendarRoot`. */
	prevPage?: (placeholder: DateValue) => DateValue
}

const { prevPage, ...props } = defineProps<CalendarNextProps>()

defineSlots<{
	default?: [{
		/** Current disable state */
		disabled: boolean
	}]
}>()

const ctx = useCalendarState()
const disabled = computed(() => ctx.disabled.value || ctx.isPrevButtonDisabled(prevPage))
</script>

<template>
	<UnstyledButton
		v-bind='props'
		aria-label='Previous page'
		:disabled
		@click='ctx.prevPage(prevPage)'
	>
		<slot :disabled>
			Prev page
		</slot>
	</UnstyledButton>
</template>
