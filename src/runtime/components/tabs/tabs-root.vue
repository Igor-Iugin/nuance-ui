<script setup lang='ts'>
import type { NuanceColor, NuanceRadius } from '@nui/types'

import { useStyleResolver } from '@nui/composables'
import { getRadius, getThemeColor } from '@nui/utils'
import { computed, onMounted, useId } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import { getSafeId, useProvideTabsContext } from './lib'
import css from './tabs.module.css'


export interface TabsRootProps extends BoxProps {
	/** Value of the tab activated by default (uncontrolled) */
	defaultTab?: string

	/**
	 * Tabs orientation
	 * @default `'horizontal'`
	 */
	orientation?: 'vertical' | 'horizontal'

	/**
	 * `TabsList` placement relative to `TabsPanel`, applicable only when `orientation="vertical"`
	 * @default `'left'`
	 */
	placement?: 'left' | 'right'

	/**
	 * Visual variant
	 * @default `'default'`
	 */
	variant?: 'default' | 'pills' | 'outline'

	/**
	 * Whether arrow key presses loop through items
	 * @default `true`
	 */
	loop?: boolean

	/**
	 * Whether a tab is activated on arrow key press
	 * @default `true`
	 */
	activateTabWithKeyboard?: boolean

	/**
	 * Whether a tab can be deactivated
	 * @default `false`
	 */
	allowTabDeactivation?: boolean

	/** Color from theme */
	color?: NuanceColor

	/** Border radius */
	radius?: NuanceRadius

	/**
	 * Inverts tab styles
	 * @default `false`
	 */
	inverted?: boolean

	/**
	 * If `false`, panel content is unmounted when inactive
	 * @default `true`
	 */
	keepMounted?: boolean

	/** Root element id */
	id?: string
}

const {
	is,
	id,
	mod,
	radius,
	color,
	placement = 'left',
	inverted,
	orientation = 'horizontal',
	variant = 'default',
	defaultTab,
	...rest
} = defineProps<TabsRootProps>()

const VALUE_ERROR = 'component was rendered with invalid value or without value'

const uid = id ?? useId()
const active = defineModel<string | null>({ default: null })

onMounted(() => {
	if (active.value === null && defaultTab) {
		active.value = defaultTab
	}
})

const style = computed(() => useStyleResolver(theme => ({
	'--tabs-radius': getRadius(radius),
	'--tabs-color': getThemeColor(color, theme),
})))

useProvideTabsContext({
	...rest,
	id: uid,
	getTabId: getSafeId(`${uid}-tab`, `TabsTab ${VALUE_ERROR}`),
	getPanelId: getSafeId(`${uid}-panel`, `TabsPanel ${VALUE_ERROR}`),
	variant,
	active,
	inverted,
	placement,
})
</script>

<template>
	<Box
		:is
		:style
		:mod='[mod, {
			orientation,
			inverted: orientation === "horizontal" && inverted,
			placement: orientation === "vertical" && placement,
			variant,
		}]'
		:class='css.root'
	>
		<slot />
	</Box>
</template>
