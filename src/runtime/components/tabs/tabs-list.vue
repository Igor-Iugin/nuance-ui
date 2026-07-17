<script setup lang='ts'>
import type { CSSProperties } from 'vue'

import { computed } from 'vue'

import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import { useTabsState } from './lib'
import css from './tabs.module.css'


export interface TabsListProps extends BoxProps {
	/** If set, tabs take all available width */
	grow?: boolean

	/** CSS `justify-content` value for the tab list */
	justify?: CSSProperties['justify-content']
}

const { is = 'header', mod, grow, justify, ...rest } = defineProps<TabsListProps>()
const ctx = useTabsState()
const style = computed(() => ({ '--tabs-justify': justify }))
</script>

<template>
	<Box
		:is
		v-bind='rest'
		:style
		:class='css.list'
		role='tablist'
		:mod='[{
			variant: ctx?.variant.value,
			grow,
			orientation: ctx?.orientation.value,
			placement: ctx?.orientation.value === "vertical" && ctx.placement.value,
			inverted: ctx?.inverted.value,
		}, mod]'
		:aria-orientation='ctx?.orientation.value'
	>
		<slot />
	</Box>
</template>
