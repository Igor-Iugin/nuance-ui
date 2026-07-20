<script lang="ts">
import type { Classes } from '@nui/types'


export interface MenuSearchProps {
	/** Placeholder text */
	placeholder?: string

	/**
	 * If set, the search value is cleared when the menu closes
	 * @default true
	 */
	clearSearchOnClose?: boolean

	/** Styles API */
	classes?: Classes<'wrapper' | 'input'>
}

const ITEM_SELECTOR = '[data-menu-item]:not([data-disabled])'

function getDropdown(input: HTMLElement): HTMLElement | null {
	return input.closest('[data-menu-dropdown]')
}

function getItems(input: HTMLElement): HTMLElement[] {
	const dropdown = getDropdown(input)
	if (!dropdown)
		return []
	return Array.from(dropdown.querySelectorAll<HTMLElement>(ITEM_SELECTOR))
}

function clearActive(input: HTMLElement): void {
	for (const item of getItems(input))
		item.removeAttribute('data-menu-active')
}

function getActiveIndex(input: HTMLElement): number {
	return getItems(input).findIndex(item => item.hasAttribute('data-menu-active'))
}

function setActive(input: HTMLElement, index: number): void {
	const items = getItems(input)
	clearActive(input)
	const item = items[index]
	if (item) {
		item.setAttribute('data-menu-active', 'true')
		item.scrollIntoView({ block: 'nearest' })
	}
}
</script>

<script lang="ts" setup>
import { onScopeDispose, useTemplateRef, watch } from 'vue'

import TextInput from '../input/text-input.vue'
import css from './menu.module.css'
import { useMenuState } from './menu.vue'


const {
	placeholder,
	clearSearchOnClose = true,
	classes,
} = defineProps<MenuSearchProps>()

const value = defineModel<string>({ default: '' })

const ctx = useMenuState()
const inputRef = useTemplateRef<{ $el: HTMLInputElement | null }>('input')

const unregister = ctx.registerSearch()
onScopeDispose(unregister)

watch(() => ctx.opened.value, opened => {
	if (!opened && clearSearchOnClose)
		value.value = ''
})

function onKeyDown(event: KeyboardEvent) {
	const input = inputRef.value?.$el
	if (!input)
		return

	const items = getItems(input)
	if (!items.length)
		return

	switch (event.key) {
		case 'ArrowDown': {
			event.preventDefault()
			const index = getActiveIndex(input)
			const next = index + 1 >= items.length
				? (ctx.loop.value ? 0 : items.length - 1)
				: index + 1
			setActive(input, next)
			break
		}
		case 'ArrowUp': {
			event.preventDefault()
			const index = getActiveIndex(input)
			const prev = index <= 0
				? (ctx.loop.value ? items.length - 1 : 0)
				: index - 1
			setActive(input, prev)
			break
		}
		case 'Home':
			event.preventDefault()
			setActive(input, 0)
			break
		case 'End':
			event.preventDefault()
			setActive(input, items.length - 1)
			break
		case 'Enter': {
			const index = getActiveIndex(input)
			const item = items[index]
			if (!item)
				break
			event.preventDefault()
			if (item.hasAttribute('data-sub-menu-item')) {
				item.focus()
				item.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
			}
			else {
				item.click()
			}
			break
		}
	}
}
</script>

<template>
	<TextInput
		ref='input'
		v-model='value'
		type='search'
		autofocus
		:placeholder
		:classes='{
			wrapper: classes?.wrapper,
			input: [css.search, ctx.classes.value?.search, classes?.input],
		}'
		@keydown='onKeyDown'
	/>
</template>
