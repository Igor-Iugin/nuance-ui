<script setup lang="ts">
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import UnstyledButton from '../../../button/unstyled-button.vue'
import { useCalendarState } from '../../lib/context'
import css from './styles/calendar-header.module.css'


export interface CalendarNextProps extends BoxProps {
	icon?: string
}

const {
	icon = 'gravity-ui:chevron-right',
	...props
} = defineProps<CalendarNextProps>()

const ctx = useCalendarState()
const disabled = computed(() => ctx.disabled.value || ctx.isNextDisabled())
</script>

<template>
	<UnstyledButton
		v-bind='props'
		aria-label='Next page'
		:disabled
		:class='css.control'
		@click='ctx.nextPage()'
	>
		<slot>
			<Icon :name='icon' :class='css.icon' />
		</slot>
	</UnstyledButton>
</template>
