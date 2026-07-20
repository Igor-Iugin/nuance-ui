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
</script>

<script lang="ts" setup>
import { computed } from 'vue'

import MenuSelectableItem from '../menu-selectable-item.vue'
import { useMenuRadioGroupState } from './menu-radio-group.vue'


const {
	value,
	color,
	closeMenuOnClick,
	disabled,
} = defineProps<MenuRadioItemProps>()

const group = useMenuRadioGroupState()
const localChecked = defineModel<boolean>('checked', { default: false })

const checked = computed(() =>
	group ? group.value.value === value : localChecked.value,
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
