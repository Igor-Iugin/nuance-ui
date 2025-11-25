<script setup lang='ts'>
import type { UiKitColor, UiKitRadius } from '@shared/ui-kit/model/theme'

import { useProvideTabsContext } from '@shared/ui-kit/components/tabs/lib'
import { useStyleResolver } from '@shared/ui-kit/lib/composals'
import { getRadius, getSafeId, getThemeColor } from '@shared/ui-kit/lib/utils'

import type { BoxProps } from '../../q-box.vue'
import UiBox from '../../q-box.vue'
import css from './tabs.module.css'


export interface TabsRootProps extends BoxProps {
	defaultTab?: string

	/** Tabs orientation, `'horizontal'` by default */
	orientation?: 'vertical' | 'horizontal'

	/** `TabsList` placement relative to `TabsPanel`, applicable only when `orientation="vertical"`, `'left'` by default */
	placement?: 'left' | 'right'

	variant?: 'default' | 'pills' | 'outline'

	/** Determines whether arrow key presses should loop though items (first to last and last to first), `true` by default */
	loop?: boolean

	/** Determines whether tab should be activated with arrow key press, `true` by default */
	activateTabWithKeyboard?: boolean

	/** Determines whether tab can be deactivated, `false` by default */
	allowTabDeactivation?: boolean

	/** Changes colors of `TabsTab` components when variant is `pills` or `default`, does nothing for other variants */
	color?: UiKitColor

	/** Key of `theme.radius` or any valid CSS value to set `border-radius`, `theme.defaultRadius` by default */
	radius?: UiKitRadius

	/** Determines whether tabs should have inverted styles, `false` by default */
	inverted?: boolean

	/** If set to `false`, `TabsPanel` content will be unmounted when the associated tab is not active, `true` by default */
	keepMounted?: boolean

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
	<UiBox
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
	</UiBox>
</template>
