<script setup lang='ts'>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import { useTabsState } from './lib'
import css from './tabs.module.css'


export interface TabsPanelProps extends BoxProps {
	/** Panel value, must match the corresponding `TabsTab` value */
	value: string
}

const { is = 'section', mod, value, ...rest } = defineProps<TabsPanelProps>()
const ctx = useTabsState()
</script>

<template>
	<Box
		:is
		v-bind='rest'
		:id='ctx?.getPanelId(value)'
		:mod='[{
			orientation: ctx?.orientation.value,
			active: ctx?.active.value === value,
		}, mod]'
		:class='css.panel'
		role='tabpanel'
		:aria-labelledby='ctx?.getTabId(value)'
	>
		<slot />
	</Box>
</template>
