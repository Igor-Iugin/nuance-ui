<script setup lang="ts">
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'
import { useCalendarState } from '../../lib/context'


export interface CalendarGridProps extends BoxProps {}


const { is = 'table', mod } = defineProps<CalendarGridProps>()

const ctx = useCalendarState()
const disabled = computed(() => ctx.disabled.value ? true : undefined)
const readonly = computed(() => ctx.readonly.value ? true : undefined)
</script>

<template>
	<Box
		:is
		:mod='[{ disabled, readonly }, mod]'
		role='grid'
		tabindex='-1'
		:aria-readonly='readonly'
		:aria-disabled='disabled'
	>
		<slot />
	</Box>
</template>
