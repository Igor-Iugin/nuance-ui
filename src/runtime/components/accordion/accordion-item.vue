<script lang='ts'>
import type { BoxProps } from '../box/box.vue'


export interface AccordionItemProps extends BoxProps {
	/** Unique value used to manage the open state. Must be unique within the accordion. */
	value: string

	/** Disables this item */
	disabled?: boolean
}
</script>

<script setup lang='ts'>
import { computed } from 'vue'

import Box from '../box/box.vue'
import css from './accordion.module.css'
import {
	provideAccordionItemState,
	useAccordionRootState,
} from './lib/context'


const { value, disabled, mod, ...rest } = defineProps<AccordionItemProps>()

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
		v-bind='rest'
		:mod='[{
			active: open,
			disabled: itemDisabled,
			state: dataState,
			variant: root.variant.value,
		}, mod]'
		:class='[css.item, root.classes.value?.item]'
	>
		<slot :open='open' />
	</Box>
</template>
