<script setup lang='ts'>
import { computed } from 'vue'

import { getSize } from '../../lib/utils'
import Box from '../box.vue'
import PopoverDropdown from '../popover/popover-dropdown.vue'
import css from './combobox.module.css'
import { useComboboxState } from './lib/context'


const { store, dropdownPadding } = useComboboxState()
const style = computed(() => ({
	'--combobox-padding': getSize(dropdownPadding, ''),
	'--combobox-option-padding': getSize(dropdownPadding, 'combobox-option-padding'),
}))
</script>

<template>
	<PopoverDropdown :class='$style.dropdown'>
		<Box
			:id='store.listId'
			role='presentation'
			:class='css.dropdown'
			:style
			v-bind='$attrs'
		>
			<slot />
		</Box>
	</PopoverDropdown>
</template>

<style module lang='postcss'>
.dropdown {
	padding: 0;
}
</style>
