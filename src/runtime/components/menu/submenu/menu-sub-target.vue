<script lang="ts" setup>
import PopoverTarget from '../../popover/popover-target.vue'
import { useSubMenuState } from './menu-sub.vue'


// Thin wrapper around PopoverTarget that opens/closes the submenu on hover.
// The primary composition uses MenuSubItem as the target instead; this exists
// for users who want a custom target element.
const sub = useSubMenuState()
</script>

<template>
	<PopoverTarget
		:id='`${sub.id}-target`'
		disable
		aria-haspopup='menu'
		:aria-expanded='sub.opened.value'
		:data-expanded='sub.opened.value ? true : undefined'
		@mouseenter='sub.open()'
		@mouseleave='sub.close()'
	>
		<slot />
	</PopoverTarget>
</template>
