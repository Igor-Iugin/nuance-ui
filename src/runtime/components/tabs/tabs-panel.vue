<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import { useTabsState } from './lib'
import css from './tabs.module.css'


export interface TabsPanelProps extends BoxProps {
	value: string
}

const { is = 'section', mod, value } = defineProps<TabsPanelProps>()
const ctx = useTabsState()
</script>

<template>
	<Box
		:is
		:id='ctx?.getPanelId(value)'
		:mod='[mod, { orientation: ctx?.orientation }]'
		:data-active='ctx?.active.value === value'
		:class='css.panel'
		role='tabpanel'
		:aria-labelledby='ctx?.getTabId(value)'
	>
		<slot />
	</Box>
</template>
