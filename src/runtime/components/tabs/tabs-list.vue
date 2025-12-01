<script setup lang='ts'>
import type { CSSProperties } from 'vue'

import { computed } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import { useTabsState } from './lib'
import css from './tabs.module.css'


export interface TabsListProps extends BoxProps {
	grow?: boolean
	justify?: CSSProperties['justify-content']
}

const { is = 'header', mod, grow, justify } = defineProps<TabsListProps>()
const ctx = useTabsState()
const style = computed(() => ({ '--tabs-justify': justify }))
</script>

<template>
	<Box
		:is
		:style
		:class='css.list'
		role='tablist'
		:mod='[mod, {
			variant: ctx?.variant,
			grow,
			orientation: ctx?.orientation,
			placement: ctx?.orientation === "vertical" && ctx.placement,
			inverted: ctx?.inverted,
		}]'
		:aria-orientation='ctx?.orientation'
	>
		<slot />
	</Box>
</template>
