<script setup lang="ts">
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import UnstyledButton from '../../../button/unstyled-button.vue'
import { useCalendarState } from '../../lib/context'
import css from './styles/calendar-header.module.css'


export interface CalendarPrevProps extends BoxProps {
	icon?: string
}

const {
	icon = 'gravity-ui:chevron-left',
	...props
} = defineProps<CalendarPrevProps>()

const ctx = useCalendarState()
const disabled = computed(() => ctx.disabled.value || ctx.isPrevDisabled())
</script>

<template>
	<UnstyledButton
		v-bind='props'
		aria-label='Previous page'
		:disabled
		:class='css.control'
		@click='ctx.prevPage()'
	>
		<slot>
			<Icon :name='icon' :class='css.icon' />
		</slot>
	</UnstyledButton>
</template>
