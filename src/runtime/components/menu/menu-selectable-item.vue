<script lang="ts" setup>
import { useConfig } from '@nui/composables'
import { computed } from 'vue'

import type { MenuBaseItemProps } from './menu-base-item.vue'

import { createItemKeydownHandler } from './lib/use-item-keydown'
import MenuBaseItem from './menu-base-item.vue'
import { useMenuState } from './menu.vue'
import { useSubMenuState } from './submenu/menu-sub.vue'


export interface MenuSelectableItemProps extends Omit<MenuBaseItemProps, 'trailingIcon'> {
	/** ARIA role determining checkbox or radio semantics */
	role?: 'menuitemcheckbox' | 'menuitemradio'

	/** Selected state */
	checked: boolean

	/** Indicator icon rendered when checked */
	indicator?: string

	/** Overrides the menu-level `closeOnItemClick` for this item */
	closeMenuOnClick?: boolean
}

const {
	mod,
	role,
	checked,
	indicator,
	closeMenuOnClick,
	disabled,
	...rest
} = defineProps<MenuSelectableItemProps>()

const emit = defineEmits<{
	/** Emitted when the item is activated */
	select: []
}>()

const { icons } = useConfig()
const ctx = useMenuState()
const sub = useSubMenuState()

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
	<MenuBaseItem
		v-bind='rest'
		:role
		:aria-checked='checked'
		:mod='[{ checked }, mod]'
		@click='onClick'
		@keydown='onKeyDown'
	>
		<template v-if='$slots.leftSection' #leftSection>
			<slot name='leftSection' />
		</template>

		<template v-if='renderIndicator' #rightSection>
			<slot name='rightSection'>
				<Icon v-if='checked' :name='indicatorIcon' />
			</slot>
		</template>

		<slot />
	</MenuBaseItem>
</template>
