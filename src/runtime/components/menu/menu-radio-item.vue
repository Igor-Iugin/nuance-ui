<script lang="ts">
import type { AnyString, NuanceColor } from '@nui/types'


export interface MenuRadioItemProps {
	/** Value used to identify the item inside a `MenuRadioGroup` */
	value: string

	/** Color from theme */
	color?: NuanceColor | AnyString

	/** Overrides the menu-level `closeOnItemClick` for this item */
	closeMenuOnClick?: boolean

	/** Disables the item */
	disabled?: boolean
}

export interface MenuRadioItemSlots {
	/** Item label */
	default?: () => any
	/** Trailing content */
	rightSection?: () => any
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'

import { useMenuRadioGroupState } from './lib/selectable-context.js'
import MenuSelectableItem from './menu-selectable-item.vue'


const { value, color, closeMenuOnClick, disabled } = defineProps<MenuRadioItemProps>()

defineSlots<MenuRadioItemSlots>()

// ponytail: the group is optional. Outside a group the item toggles its own
// `v-model:checked`; inside one the group's value drives the checked state.
const group = useMenuRadioGroupState()
const localChecked = defineModel<boolean>('checked', { default: false })

const checked = computed(() =>
	group ? group.value === value : localChecked.value,
)

function onSelect() {
	if (group)
		group.onChange(value)
	else
		localChecked.value = true
}
</script>

<template>
	<MenuSelectableItem
		role='menuitemradio'
		:checked='checked'
		:color
		:close-menu-on-click='closeMenuOnClick'
		:disabled
		@select='onSelect'
	>
		<slot />

		<template v-if='$slots.rightSection' #rightSection>
			<slot name='rightSection' />
		</template>
	</MenuSelectableItem>
</template>
