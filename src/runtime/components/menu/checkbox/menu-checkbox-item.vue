<script lang="ts" setup>
import type { AnyString, NuanceColor } from '@nui/types'

import { computed } from 'vue'

import MenuSelectableItem from '../menu-selectable-item.vue'
import { useMenuCheckboxGroupState } from './menu-checkbox-group.vue'


export interface MenuCheckboxItemProps {
	/**
	 * Value used to identify the item inside a `MenuCheckboxGroup`.
	 * Required when the item participates in a group.
	 */
	value?: string

	/** Color from theme */
	color?: NuanceColor | AnyString

	/** Overrides the menu-level `closeOnItemClick` for this item */
	closeMenuOnClick?: boolean

	/** Disables the item */
	disabled?: boolean
}

const {
	value,
	color,
	closeMenuOnClick,
	disabled,
} = defineProps<MenuCheckboxItemProps>()

const group = useMenuCheckboxGroupState()
const localChecked = defineModel<boolean>('checked', { default: false })

const checked = computed(() =>
	group && value !== undefined
		? group.value.value.includes(value)
		: localChecked.value,
)

function onSelect() {
	if (group && value !== undefined)
		group.onChange(value, !checked.value)
	else
		localChecked.value = !localChecked.value
}
</script>

<template>
	<MenuSelectableItem
		role='menuitemcheckbox'
		:checked
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
