<script lang="ts" setup>
import { unrefElement } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import PopoverDropdown from '../../popover/popover-dropdown.vue'
import { useTypeAhead } from '../lib/use-type-ahead'
import css from '../menu.module.css'
import { useMenuState } from '../menu.vue'
import { useSubMenuState } from './menu-sub.vue'


const dropdown = useTemplateRef('dropdown')

const ctx = useMenuState()
const sub = useSubMenuState()

const getDropdown = () => (unrefElement(dropdown) as HTMLElement | null) ?? null

const typeAhead = useTypeAhead({
	enabled: () => !ctx.hasSearch.value,
	opened: sub.opened,
	getDropdown,
})

function onKeyDown(event: KeyboardEvent) {
	// Stop printable single-char keys from bubbling so the parent menu
	// type-ahead does not also react to them.
	if (
		event.key.length === 1
		&& !event.ctrlKey
		&& !event.metaKey
		&& !event.altKey
	) {
		event.stopPropagation()
	}

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
		:id='`${sub.id}-dropdown`'
		ref='dropdown'
		role='menu'
		aria-orientation='vertical'
		tabindex='-1'
		data-menu-dropdown
		:data-expanded='sub.opened.value ? true : undefined'
		:class='css.dropdown'
		@mouseenter='sub.open()'
		@mouseleave='sub.close()'
		@keydown='onKeyDown'
	>
		<slot />
	</PopoverDropdown>
</template>
