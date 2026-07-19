const ITEM_SELECTOR = '[data-menu-item]:not([data-disabled])'
const DROPDOWN_SELECTOR = '[data-menu-dropdown]'

interface ScopedKeydownOptions {
	/** If set, focus wraps from last item to first and vice versa */
	loop: boolean
	/** Extra handler invoked before scoped navigation runs */
	onKeyDown?: (event: KeyboardEvent) => void
}

function getSiblings(current: HTMLElement): HTMLElement[] {
	const dropdown = current.closest(DROPDOWN_SELECTOR)
	if (!dropdown)
		return [current]
	return Array.from(dropdown.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
		item => item.closest(DROPDOWN_SELECTOR) === dropdown,
	)
}

/**
 * Vertical roving-focus keydown handler scoped to the nearest menu dropdown.
 * Moves focus between `[data-menu-item]` siblings with Arrow/Home/End keys.
 */
export function createItemKeydownHandler({ loop, onKeyDown }: ScopedKeydownOptions) {
	return function handleKeyDown(event: KeyboardEvent) {
		onKeyDown?.(event)
		if (event.defaultPrevented)
			return

		const current = event.currentTarget as HTMLElement
		const items = getSiblings(current)
		const index = items.indexOf(current)
		if (index === -1)
			return

		let next: HTMLElement | undefined

		switch (event.key) {
			case 'ArrowDown':
				next = items[index + 1] ?? (loop ? items[0] : undefined)
				break
			case 'ArrowUp':
				next = items[index - 1] ?? (loop ? items[items.length - 1] : undefined)
				break
			case 'Home':
				next = items[0]
				break
			case 'End':
				next = items[items.length - 1]
				break
			default:
				return
		}

		if (next) {
			event.preventDefault()
			next.focus()
		}
	}
}
