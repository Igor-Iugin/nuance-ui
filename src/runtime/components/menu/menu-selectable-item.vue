<script lang="ts">
import type { AnyString, NuanceColor } from '@nui/types'


export interface MenuSelectableItemProps {
	/** ARIA role determining checkbox or radio semantics */
	role: 'menuitemcheckbox' | 'menuitemradio'

	/** Selected state */
	checked: boolean

	/** Indicator icon rendered when checked */
	indicator?: string

	/** Color from theme */
	color?: NuanceColor | AnyString

	/** Overrides the menu-level `closeOnItemClick` for this item */
	closeMenuOnClick?: boolean

	/** Disables the item */
	disabled?: boolean
}

export interface MenuSelectableItemSlots {
	/** Item label */
	default?: () => any
	/** Trailing content */
	rightSection?: () => any
}

export interface MenuSelectableItemEmits {
	/** Emitted when the item is activated */
	select: []
}
</script>

<script lang="ts" setup>
import { useConfig, useVarsResolver } from '@nui/composables'
import { getThemeColor } from '@nui/utils'
import { computed } from 'vue'

import UnstyledButton from '../button/unstyled-button.vue'
import { useSubMenuState } from './lib/context.js'
import { createItemKeydownHandler } from './lib/use-item-keydown.js'
import css from './menu.module.css'
import { useMenuState } from './menu.vue'


const { role, checked, indicator, color, closeMenuOnClick, disabled } = defineProps<MenuSelectableItemProps>()

const emit = defineEmits<MenuSelectableItemEmits>()

defineSlots<MenuSelectableItemSlots>()

const { icons } = useConfig()
const ctx = useMenuState()
const sub = useSubMenuState()

interface Vars {
	root: '--menu-item-color'
}

// ponytail: no light-variant hover resolver exists in this repo, so only the
// text color var is set and `--menu-item-hover` is left to the CSS default.
const style = useVarsResolver<Vars>(theme => ({
	root: {
		'--menu-item-color': color ? getThemeColor(color, theme) : undefined,
	},
}))

const indicatorIcon = computed(() => indicator ?? ctx.checkIcon.value ?? icons.check)
const renderIndicator = computed(() => ctx.alignItemsLabels.value !== 'none' || checked)

function onClick() {
	if (disabled)
		return
	emit('select')
	if (closeMenuOnClick)
		ctx.closeDropdownImmediately()
}

const onKeyDown = createItemKeydownHandler({
	loop: ctx.loop.value,
	onKeyDown(event) {
		if (event.key === 'ArrowLeft' && sub) {
			sub.close()
			sub.focusParentItem()
		}
	},
})
</script>

<template>
	<UnstyledButton
		:role
		:aria-checked='checked'
		data-menu-item
		:data-checked='checked || undefined'
		:data-disabled='disabled || undefined'
		:tabindex='ctx.menuItemTabIndex.value'
		data-nuance-stop-propagation
		:style='style.root'
		:class='[css.item, ctx.classes.value?.item]'
		@mousedown.prevent
		@click='onClick'
		@keydown='onKeyDown'
	>
		<div
			v-if='renderIndicator'
			:class='[css.itemIndicator, ctx.classes.value?.itemIndicator]'
			:data-checked='checked || undefined'
		>
			<Icon v-if='checked' :name='indicatorIcon' />
		</div>

		<div :class='[css.itemLabel, ctx.classes.value?.itemLabel]' data-menu-item-label>
			<slot />
		</div>

		<div
			v-if='$slots.rightSection'
			:class='[css.itemSection, ctx.classes.value?.itemSection]'
			data-position='right'
		>
			<slot name='rightSection' />
		</div>
	</UnstyledButton>
</template>
