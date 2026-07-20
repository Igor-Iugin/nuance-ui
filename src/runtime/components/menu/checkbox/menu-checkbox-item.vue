<script lang="ts" setup>
import { computed } from 'vue'

import type { MenuSelectableItemProps } from '../menu-selectable-item.vue'

import MenuSelectableItem from '../menu-selectable-item.vue'
import { useMenuCheckboxGroupState } from './menu-checkbox-group.vue'


export interface MenuCheckboxItemProps extends Omit<MenuSelectableItemProps, 'checked'> {
	/**
	 * Value used to identify the item inside a `MenuCheckboxGroup`.
	 * Required when the item participates in a group.
	 */
	value?: string
}

const {
	value,
	role = 'menuitemcheckbox',
	...rest
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
		v-bind='rest'
		static-r-section
		:role
		:checked
		@select='onSelect'
	>
		<template v-if='$slots.leftSection' #leftSection>
			<slot name='leftSection' />
		</template>

		<template v-if='$slots.rightSection' #rightSection>
			<slot name='rightSection' />
		</template>

		<slot />
	</MenuSelectableItem>
</template>
