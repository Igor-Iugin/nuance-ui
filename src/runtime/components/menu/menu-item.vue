<script lang="ts" setup>
import type { MenuBaseItemProps } from './menu-base-item.vue'

import { createItemKeydownHandler } from './lib/use-item-keydown'
import MenuBaseItem from './menu-base-item.vue'
import { useMenuState } from './menu.vue'
import { useSubMenuState } from './submenu/menu-sub.vue'


export interface MenuItemProps extends MenuBaseItemProps {
	/** Overrides the menu-level `closeOnItemClick` for this item */
	closeMenuOnClick?: boolean
}

const {
	disabled,
	closeMenuOnClick,
	...rest
} = defineProps<MenuItemProps>()

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
		if (event.key === 'ArrowLeft' && sub) {
			sub.close()
			sub.focusParentItem()
		}
	},
})
</script>

<template>
	<MenuBaseItem
		role='menuitem'
		:disabled
		v-bind='rest'
		@click='onClick'
		@keydown='onKeyDown'
	>
		<template v-if='$slots.leftSection' #leftSection>
			<slot name='leftSection' />
		</template>

		<template v-if='$slots.rightSection' #rightSection>
			<slot name='rightSection' />
		</template>

		<slot />
	</MenuBaseItem>
</template>
