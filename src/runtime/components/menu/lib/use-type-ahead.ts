import type { MaybeRefOrGetter } from 'vue'

import { refAutoReset } from '@vueuse/core'
import { toValue, watch } from 'vue'


const RESET_DELAY = 500

interface UseTypeAheadOptions {
	/** Whether type-ahead handling is active */
	enabled: MaybeRefOrGetter<boolean>
	/** Whether the owning menu is open */
	opened: MaybeRefOrGetter<boolean>
	/** Resolve the dropdown element that scopes the searchable items */
	getDropdown: () => HTMLElement | null
}

function getItemText(item: HTMLElement): string {
	const label = item.querySelector<HTMLElement>('[data-menu-item-label]')
	return ((label ?? item).textContent ?? '').trim().toLowerCase()
}

function isRepeatedChar(buffer: string): boolean {
	return buffer.length > 1 && buffer.split('').every(char => char === buffer[0])
}

/**
 * Focuses menu items by typed characters. Single-char repeats cycle through
 * items sharing the first letter; longer buffers match by prefix.
 * The typed buffer auto-clears after a short pause.
 */
export function useTypeAhead({ enabled, opened, getDropdown }: UseTypeAheadOptions) {
	const buffer = refAutoReset('', RESET_DELAY)

	watch(() => toValue(opened) && toValue(enabled), active => {
		if (!active)
			buffer.value = ''
	})

	return function onKeyDown(event: KeyboardEvent) {
		if (!toValue(enabled) || event.defaultPrevented)
			return
		if (event.ctrlKey || event.metaKey || event.altKey)
			return
		if (event.key.length !== 1 || event.key === ' ')
			return

		const target = event.target as HTMLElement | null
		if (
			target
			&& (target.tagName === 'INPUT'
				|| target.tagName === 'TEXTAREA'
				|| target.tagName === 'SELECT'
				|| target.isContentEditable)
		) {
			return
		}


		const dropdown = getDropdown()
		if (!dropdown)
			return

		const items = Array.from(
			dropdown.querySelectorAll<HTMLElement>('[data-menu-item]:not([data-disabled])'),
		).filter(item => item.closest('[data-menu-dropdown]') === dropdown)

		if (items.length === 0)
			return

		buffer.value = (buffer.value + event.key).toLowerCase()

		const activeElement = document.activeElement as HTMLElement | null
		const currentIndex = activeElement ? items.indexOf(activeElement) : -1

		let match: HTMLElement | null = null

		if (buffer.value.length === 1 || isRepeatedChar(buffer.value)) {
			const char = buffer.value[0]!
			const startIndex = currentIndex + 1
			for (let i = 0; i < items.length; i += 1) {
				const idx = (startIndex + i) % items.length
				if (getItemText(items[idx]!).startsWith(char)) {
					match = items[idx]!
					break
				}
			}
		}
		else {
			for (const item of items) {
				if (getItemText(item).startsWith(buffer.value)) {
					match = item
					break
				}
			}
		}

		if (match) {
			event.preventDefault()
			match.focus()
		}
	}
}
