<script setup lang="ts">
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import UnstyledButton from '../../../button/unstyled-button.vue'
import { useCalendarState } from '../../lib/context'


export interface CalendarPrevProps extends BoxProps {
}

const props = defineProps<CalendarPrevProps>()

defineSlots<{
	default?: [{
		/** Current disable state */
		disabled: boolean
	}]
}>()

const ctx = useCalendarState()
const disabled = computed(() => ctx.disabled.value || ctx.isPrevDisabled())
</script>

<template>
	<UnstyledButton
		v-bind='props'
		aria-label='Previous page'
		:disabled
		@click='ctx.prevPage()'
	>
		<slot :disabled>
			Prev page
		</slot>
	</UnstyledButton>
</template>
