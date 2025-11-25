<script setup lang='ts'>
import type { Mod } from '@shared/ui-kit/lib/composals'

import { UnstyledButton } from '@shared/ui-kit'

import { useTabsState } from '../lib'
import css from './tabs.module.css'


export interface TabsTabProps {
	value: string
	mod?: Mod | Mod[]
}

const { value, mod } = defineProps<TabsTabProps>()
const ctx = useTabsState()

const active = computed(() => value === ctx?.active.value)
</script>

<template>
	<UnstyledButton
		:id='ctx?.getTabId(value)'
		:mod='[mod, {
			variant: ctx?.variant,
			active,
			orientation: ctx?.orientation,
			inverted: ctx?.inverted,
			placement: ctx?.orientation === "vertical" && ctx.placement,
		}]'
		:class='css.tab'
		role='tab'
		:aria-selected='active'
		:tabindex='$attrs?.tabIndex !== undefined ? $attrs?.tabIndex : active || ctx?.active.value === null ? 0 : -1'
		:aria-controls='ctx?.getPanelId(value)'
		@click='ctx?.onUpdate(value)'
	>
		<span v-if='$slots.leftSection' :class='css.tabSection' data-position='left'>
			<slot name='leftSection'/>
		</span>
		<span v-if='$slots.default' :class='css.tabLabel'>
			<slot/>
		</span>
		<span v-if='$slots.rightSection' :class='css.tabSection' data-position='right'>
			<slot name='rightSection'/>
		</span>
	</UnstyledButton>
</template>
