<script lang="ts">
import type { AnyString, NuanceColor } from '@nui/types'


export interface MenuSelectableItemProps {
	icon?: string
	description?: string

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
</script>

<script lang="ts" setup>
import { useConfig, useVarsResolver } from '@nui/composables'
import { getThemeColor } from '@nui/utils'
import { computed } from 'vue'

import UnstyledButton from '../button/unstyled-button.vue'
import { createItemKeydownHandler } from './lib/use-item-keydown'
import css from './menu.module.css'
import { useMenuState } from './menu.vue'
import { useSubMenuState } from './submenu/menu-sub.vue'


const {
	icon,
	description,
	role,
	checked,
	indicator,
	color,
	closeMenuOnClick,
	disabled,
} = defineProps<MenuSelectableItemProps>()

const emit = defineEmits<{
	/** Emitted when the item is activated */
	select: []
}>()

const { icons } = useConfig()
const ctx = useMenuState()
const sub = useSubMenuState()

const style = useVarsResolver<{
	root: '--menu-item-color'
}>(theme => ({
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
	loop: ctx.loop,
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
		:mod='{ checked, disabled }'
		:tabindex='ctx.menuItemTabIndex.value'
		:style='style.root'
		:class='[css.item, ctx.classes.value?.item]'
		@mousedown.prevent
		@click='onClick'
		@keydown='onKeyDown'
	>
		<div
			v-if='$slots.leftSection || icon'
			:class='[css.itemIndicator, ctx.classes.value?.itemIndicator]'
			:data-checked='checked || undefined'
		>
			<slot name='leftSection'>
				<Icon v-if='icon' :name='icon' />
			</slot>
		</div>

		<div
			:class='[css.itemLabel, ctx.classes.value?.itemLabel]'
			data-menu-item-label
		>
			<span>
				<slot />
			</span>
			<span :class='css.itemDescription'>
				{{ description }}
			</span>
		</div>

		<div
			v-if='renderIndicator'
			:class='[css.itemSection, ctx.classes.value?.itemSection]'
			data-position='right'
		>
			<Icon v-if='checked' :name='indicatorIcon' />
		</div>
	</UnstyledButton>
</template>
