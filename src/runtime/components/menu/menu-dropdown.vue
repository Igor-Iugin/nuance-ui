<script lang="ts" setup>
import { unrefElement } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import PopoverDropdown from '../popover/popover-dropdown.vue'
import { useTypeAhead } from './lib/use-type-ahead'
import css from './menu.module.css'
import { useMenuState } from './menu.vue'


const dropdown = useTemplateRef<HTMLElement>('dropdown')

const ctx = useMenuState()

const getDropdown = () => unrefElement(dropdown) ?? null

const typeAhead = useTypeAhead({
	enabled: () => !ctx.hasSearch.value,
	opened: ctx.opened,
	getDropdown,
})

function onKeyDown(event: KeyboardEvent) {
	typeAhead(event)

	if (event.defaultPrevented || ctx.hasSearch.value)
		return

	if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
		event.preventDefault()
		getDropdown()
			?.querySelectorAll<HTMLButtonElement>('[data-menu-item]:not(:disabled)')[0]
			?.focus()
	}
}
</script>

<template>
	<PopoverDropdown
		ref='dropdown'
		role='menu'
		aria-orientation='vertical'
		tabindex='-1'
		data-menu-dropdown
		:data-expanded='ctx.opened.value ? true : undefined'
		:class='css.dropdown'
		@keydown='onKeyDown'
	>
		<div
			v-if='ctx.withInitialFocusPlaceholder.value && !ctx.hasSearch.value'
			role='presentation'
			tabindex='-1'
			data-autofocus
			data-nuance-stop-propagation
			:style='{ outline: 0 }'
		/>
		<slot />
	</PopoverDropdown>
</template>
