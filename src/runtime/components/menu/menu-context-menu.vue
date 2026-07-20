<script lang="ts" setup>
import { reactive, ref } from 'vue'

import type { MenuProps } from './menu.vue'

import MenuDropdown from './menu-dropdown.vue'
import MenuTarget from './menu-target.vue'
import Menu from './menu.vue'


defineProps<MenuProps>()

defineSlots<{
	/** Menu items rendered inside the context menu dropdown */
	default?: () => any
	/** Trigger area, receives an `onContextMenu` handler to bind to `@contextmenu` */
	trigger?: (props: { onContextMenu: (event: MouseEvent) => void }) => any
}>()

const opened = ref(false)
const anchor = reactive({ x: 0, y: 0 })

function onContextMenu(event: MouseEvent) {
	event.preventDefault()
	anchor.x = event.clientX
	anchor.y = event.clientY
	opened.value = true
}
</script>

<template>
	<Menu
		v-bind='$props'
		v-model:open='opened'
		placement='bottom-start'
	>
		<MenuTarget>
			<div
				:style='{
					position: "fixed",
					left: `${anchor.x}px`,
					top: `${anchor.y}px`,
					width: 0,
					height: 0,
				}'
			/>
		</MenuTarget>

		<MenuDropdown>
			<slot />
		</MenuDropdown>
	</Menu>

	<slot name='trigger' :on-context-menu='onContextMenu' />
</template>
