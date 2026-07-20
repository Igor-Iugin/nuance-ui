<script lang="ts" setup>
import { computed } from 'vue'

import type { MenuSelectableItemProps } from '../menu-selectable-item.vue'

import MenuSelectableItem from '../menu-selectable-item.vue'
import { useMenuRadioGroupState } from './menu-radio-group.vue'


export interface MenuRadioItemProps extends Omit<MenuSelectableItemProps, 'checked'> {
	/** Value used to identify the item inside a `MenuRadioGroup` */
	value: string
}

const {
	value,
	role = 'menuitemradio',
	...rest
} = defineProps<MenuRadioItemProps>()

const group = useMenuRadioGroupState()
const localChecked = defineModel<boolean>('checked', { default: false })

const checked = computed(() => group ? group.value.value === value : localChecked.value)
</script>

<template>
	<MenuSelectableItem
		v-bind='rest'
		:role
		:checked
		static-r-section
		@select='group ? group.onChange(value) : (localChecked = true)'
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
