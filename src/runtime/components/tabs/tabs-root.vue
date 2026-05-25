<script setup lang='ts'>
import type { NuanceColor, NuanceRadius } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getRadius, getThemeColor } from '@nui/utils'
import { computed, onMounted, toRefs, useId } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import { getSafeId, useProvideTabsContext } from './lib'
import css from './tabs.module.css'


interface TabsRootVars {
	root: '--tabs-radius' | '--tabs-color'
}

export type TabsVariant = 'default' | 'pills' | 'outline'

export interface TabsRootProps extends BoxProps {
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

	/** Visual variant */
	variant?: TabsVariant

	/** Color from theme */
	color?: NuanceColor

	/** Border radius */
	radius?: NuanceRadius

	/**
	 * Inverts tab styles
	 * @default `false`
	 */
	inverted?: boolean

	/** Root element id */
	id?: string

	/** Value of the tab activated by default (uncontrolled) */
	defaultTab?: string

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

	/**
	 * If `false`, panel content is unmounted when inactive
	 * @default `true`
	 */
	keepMounted?: boolean
}

const props = withDefaults(defineProps<TabsRootProps>(), {
	placement: 'left',
	orientation: 'horizontal',
	variant: 'default',
})

const uid = computed(() => props.id ?? useId())
const active = defineModel<string | null>({ default: null })

onMounted(() => {
	if (active.value === null && props.defaultTab) {
		active.value = props.defaultTab
	}
})

const style = useVarsResolver<TabsRootVars>(theme => ({
	root: {
		'--tabs-radius': getRadius(props.radius),
		'--tabs-color': getThemeColor(props.color, theme),
	},
}))

const VALUE_ERROR = 'component was rendered with invalid value or without value'

const refs = toRefs(props)

useProvideTabsContext({
	...refs,
	active,
	id: uid,
	getTabId: getSafeId(`${uid.value}-tab`, `TabsTab ${VALUE_ERROR}`),
	getPanelId: getSafeId(`${uid.value}-panel`, `TabsPanel ${VALUE_ERROR}`),
})
</script>

<template>
	<Box
		:is
		:style='style.root'
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
