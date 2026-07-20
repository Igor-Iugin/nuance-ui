<script lang="ts" setup>
import PopoverTarget from '../popover/popover-target.vue'
import { useMenuState } from './menu.vue'


const ctx = useMenuState()

function onClick() {
	if (ctx.trigger.value === 'click') {
		ctx.toggleDropdown()
	}
	else if (ctx.trigger.value === 'click-hover') {
		ctx.setOpenedViaClick(true)
		!ctx.opened.value && ctx.openDropdown()
	}
}

function onEnter() {
	if (ctx.trigger.value === 'hover' || ctx.trigger.value === 'click-hover')
		ctx.openDropdown()
}

function onLeave() {
	if (ctx.trigger.value === 'hover')
		ctx.closeDropdown()
	else if (ctx.trigger.value === 'click-hover' && !ctx.openedViaClick.value)
		ctx.closeDropdown()
}
</script>

<template>
	<PopoverTarget
		manual
		:data-expanded='ctx.opened.value ? true : undefined'
		@click='onClick()'
		@mouseenter='onEnter()'
		@mouseleave='onLeave()'
	>
		<slot />
	</PopoverTarget>
</template>
