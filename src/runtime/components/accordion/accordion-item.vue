<script lang='ts'>
export interface AccordionItemProps {
	/** Unique value used to manage the open state. Must be unique within the accordion. */
	value: string

	/** Disables this item */
	disabled?: boolean
}
</script>

<script setup lang='ts'>
import { computed } from 'vue'

import Box from '../box.vue'
import css from './accordion.module.css'
import {
	provideAccordionItemState,
	useAccordionRootState,
} from './lib/context'


const { value, disabled } = defineProps<AccordionItemProps>()

const root = useAccordionRootState()

const open = computed(() => root.isItemActive(value))
const itemDisabled = computed(() => root.disabled.value || disabled)
const dataState = computed<'open' | 'closed'>(() => open.value ? 'open' : 'closed')

provideAccordionItemState({
	value: computed(() => value),
	open,
	disabled: itemDisabled,
	dataState,
})
</script>

<template>
	<Box
		:mod='{
			active: open,
			disabled: itemDisabled,
			state: dataState,
			variant: root.variant.value,
		}'
		:class='[
			css.item,
			root.classes.value?.item,
		]'
	>
		<slot :open='open' />
	</Box>
</template>
