<script setup lang="ts">
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import UnstyledButton from '../../../button/unstyled-button.vue'
import { useCalendarState } from '../../lib/context'


export interface CalendarNextProps extends BoxProps {
}

const props = defineProps<CalendarNextProps>()

defineSlots<{
	default?: [{
		/** Current disable state */
		disabled: boolean
	}]
}>()

const ctx = useCalendarState()
const disabled = computed(() => ctx.disabled.value || ctx.isNextDisabled())
</script>

<template>
	<UnstyledButton
		v-bind='props'
		aria-label='Next page'
		:disabled
		@click='ctx.nextPage()'
	>
		<slot :disabled>
			Next page
		</slot>
	</UnstyledButton>
</template>
