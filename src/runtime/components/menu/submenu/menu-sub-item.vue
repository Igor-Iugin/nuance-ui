<script lang="ts" setup>
import { useConfig } from '@nui/composables'

import type { MenuBaseItemProps } from '../menu-base-item.vue'

import PopoverTarget from '../../popover/popover-target.vue'
import { createItemKeydownHandler } from '../lib/use-item-keydown'
import MenuBaseItem from '../menu-base-item.vue'
import css from '../menu.module.css'
import { useMenuState } from '../menu.vue'
import { useSubMenuState } from './menu-sub.vue'


export interface MenuSubItemProps extends MenuBaseItemProps {
	/** Overrides the menu-level `closeOnItemClick` for this item */
	closeMenuOnClick?: boolean
}

const { mod, closeMenuOnClick, disabled, ...rest } = defineProps<MenuSubItemProps>()

const { icons } = useConfig()
const ctx = useMenuState()
const sub = useSubMenuState()

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
	<PopoverTarget manual>
		<MenuBaseItem
			:id='`${sub?.id}-target`'
			role='menuitem'
			data-sub-menu-item
			aria-haspopup='menu'
			v-bind='rest'
			:disabled
			:aria-expanded='sub?.opened.value'
			:mod='[{ expanded: sub?.opened.value }, mod]'
			@click='onClick'
			@mouseenter='sub?.open()'
			@mouseleave='sub?.close()'
			@keydown='onKeyDown'
		>
			<template v-if='$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>

			<template #rightSection>
				<slot name='rightSection'>
					<Icon :name='icons.chevronDown' :class='[css.chevron, ctx.classes.value?.chevron]' />
				</slot>
			</template>

			<slot />
		</MenuBaseItem>
	</PopoverTarget>
</template>
