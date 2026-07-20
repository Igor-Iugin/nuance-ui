<script lang="ts">
import type { AnyString, NuanceColor } from '@nui/types'


export interface MenuItemProps {
	icon?: string
	description?: string

	/** Color from theme */
	color?: NuanceColor | AnyString

	/** Overrides the menu-level `closeOnItemClick` for this item */
	closeMenuOnClick?: boolean

	/** Disables the item */
	disabled?: boolean

	active?: boolean
}
</script>

<script lang="ts" setup>
import { useVarsResolver } from '@nui/composables'
import { getThemeColor } from '@nui/utils'

import UnstyledButton from '../button/unstyled-button.vue'
import { createItemKeydownHandler } from './lib/use-item-keydown'
import css from './menu.module.css'
import { useMenuState } from './menu.vue'
import { useSubMenuState } from './submenu/menu-sub.vue'


const {
	icon,
	description,
	color,
	closeMenuOnClick,
	disabled,
	active,
} = defineProps<MenuItemProps>()

const ctx = useMenuState()
const sub = useSubMenuState()

const style = useVarsResolver<{
	root: '--menu-item-color'
}>(theme => ({
	root: {
		'--menu-item-color': color ? getThemeColor(color, theme) : undefined,
	},
}))

function onClick() {
	if (disabled)
		return

	const close = typeof closeMenuOnClick === 'boolean'
		? closeMenuOnClick
		: ctx.closeOnItemClick.value

	if (close)
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
		role='menuitem'
		data-menu-item
		:mod='{ active, disabled }'
		:disabled
		:tabindex='ctx.menuItemTabIndex.value'
		:style='style.root'
		:class='[css.item, ctx.classes.value?.item]'
		@mousedown.prevent
		@click='onClick'
		@keydown='onKeyDown'
	>
		<div
			v-if='ctx.alignItemsLabels.value === "all"'
			:class='[css.itemIndicator, ctx.classes.value?.itemIndicator]'
		/>

		<div
			v-if='$slots.leftSection'
			:class='[css.itemSection, ctx.classes.value?.itemSection]'
			data-position='left'
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
			v-if='$slots.rightSection'
			:class='[css.itemSection, ctx.classes.value?.itemSection]'
			data-position='right'
		>
			<slot name='rightSection' />
		</div>
	</UnstyledButton>
</template>
