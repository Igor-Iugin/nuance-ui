<script lang="ts">
import type { AnyString, NuanceColor } from '@nui/types'


export interface MenuSubItemProps {
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

import UnstyledButton from '../../button/unstyled-button.vue'
import PopoverTarget from '../../popover/popover-target.vue'
import { createItemKeydownHandler } from '../lib/use-item-keydown'
import css from '../menu.module.css'
import { useMenuState } from '../menu.vue'
import { useSubMenuState } from './menu-sub.vue'


const { color, closeMenuOnClick, disabled } = defineProps<MenuSubItemProps>()

const { icons } = useConfig()
const ctx = useMenuState()
const sub = useSubMenuState()

const style = useVarsResolver<{ root: '--menu-item-color' }>(theme => ({
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
		if (event.key === 'ArrowRight') {
			event.preventDefault()
			sub?.open()
			sub?.focusFirstItem()
		}
		else if (event.key === 'ArrowLeft' && sub?.parentContext) {
			event.preventDefault()
			sub?.parentContext.close()
			sub?.parentContext.focusParentItem()
		}
	},
})
</script>

<template>
	<PopoverTarget disable>
		<UnstyledButton
			:id='`${sub?.id}-target`'
			role='menuitem'
			data-menu-item
			data-sub-menu-item
			aria-haspopup='menu'
			:aria-expanded='sub?.opened.value'
			:data-disabled='disabled || undefined'
			:data-expanded='sub?.opened.value ? true : undefined'
			:tabindex='ctx.menuItemTabIndex.value'
			data-nuance-stop-propagation
			:style='style.root'
			:class='[css.item, ctx.classes.value?.item]'
			@mousedown.prevent
			@click='onClick'
			@mouseenter='sub?.open()'
			@mouseleave='sub?.close()'
			@keydown='onKeyDown'
		>
			<div
				v-if='ctx.alignItemsLabels.value === "all"'
				:class='[css.itemIndicator, ctx.classes.value?.itemIndicator]'
				data-placeholder
			/>

			<div
				v-if='$slots.leftSection'
				:class='[css.itemSection, ctx.classes.value?.itemSection]'
				data-position='left'
			>
				<slot name='leftSection' />
			</div>

			<div :class='[css.itemLabel, ctx.classes.value?.itemLabel]' data-menu-item-label>
				<slot />
			</div>

			<div
				:class='[css.itemSection, ctx.classes.value?.itemSection]'
				data-position='right'
			>
				<slot name='rightSection'>
					<Icon :name='icons.chevronDown' :class='[css.chevron, ctx.classes.value?.chevron]' />
				</slot>
			</div>
		</UnstyledButton>
	</PopoverTarget>
</template>
