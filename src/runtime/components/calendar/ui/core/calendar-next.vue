<script setup lang="ts">
import type { DateValue } from '@internationalized/date'

import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import UnstyledButton from '../../../button/unstyled-button.vue'
import { useCalendarState } from '../../lib/context'


export interface CalendarNextProps extends BoxProps {
	/** The function to be used for the next page. Overwrites the `nextPage` function set on the `CalendarRoot`. */
	nextPage?: (placeholder: DateValue) => DateValue
}

const { nextPage, ...props } = defineProps<CalendarNextProps>()

defineSlots<{
	default?: [{
		/** Current disable state */
		disabled: boolean
	}]
}>()

const ctx = useCalendarState()
const disabled = computed(() => ctx.disabled.value || ctx.isNextButtonDisabled(nextPage))
</script>

<template>
	<UnstyledButton
		v-bind='props'
		aria-label='Next page'
		:disabled
		@click='ctx.nextPage(nextPage)'
	>
		<slot :disabled>
			Next page
		</slot>
	</UnstyledButton>
</template>
