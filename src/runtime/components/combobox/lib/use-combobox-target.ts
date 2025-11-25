import { onKeyStroke } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

import { useComboboxState } from './context'


interface UseComboboxTargetPropsInput {
	targetType: 'input' | 'button' | undefined
	withAriaAttributes: boolean | undefined
	withKeyboardNavigation: boolean | undefined
	withExpandedAttribute: boolean | undefined
	autoComplete: string | undefined
}

export function useComboboxTarget({
	targetType,
	withAriaAttributes,
	autoComplete,
	withExpandedAttribute,
	withKeyboardNavigation,
}: UseComboboxTargetPropsInput) {
	const ctx = useComboboxState()
	const selected = shallowRef<string | null>(null)

	onKeyStroke(['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Space'], event => {
		if (ctx.readOnly || !withKeyboardNavigation)
			return
		if (event.isComposing)
			return

		event.preventDefault()
		event.stopPropagation()

		switch (event.code) {
			case 'ArrowUp':
			case 'ArrowDown': {
				if (!ctx.opened.value) {
					ctx.store.openDropdown('keyboard')
					selected.value = ctx.store.selectActiveOption()
					ctx.store.updateSelectedOptionIx('selected', { scrollIntoView: true })
				}
				else {
					selected.value = event.code === 'ArrowDown'
						? ctx.store.selectNextOption()
						: ctx.store.selectPrevOption()
				}
				break
			}

			case 'Enter':
			case 'NumpadEnter': {
				// This is a workaround for handling differences in behavior of isComposing property in Safari
				// See: https://dninomiya.github.io/form-guide/stop-enter-submit
				// @typescript-eslint/no-deprecated
				if (event.keyCode === 229)
					break

				const selectedIx = ctx.store.getSelectedOptionIx()

				if (ctx.opened.value && selectedIx !== -1)
					ctx.store.clickSelectedOption()
				else if (targetType === 'button')
					ctx.store.openDropdown('keyboard')

				break
			}

			case 'Escape': {
				ctx.store.closeDropdown('keyboard')
				break
			}
			case 'Space': {
				if (targetType === 'button')
					ctx.store.toggleDropdown('keyboard')
				break
			}

			default:
				break
		}
	}, { target: ctx.store.targetRef })

	return computed(() => withAriaAttributes
		? {
			'aria-haspopup': 'listbox' as const,
			'aria-expanded': withExpandedAttribute ? !!(ctx.store.listId && ctx.opened.value) : undefined,
			'aria-controls': ctx.opened.value && ctx.store.listId ? ctx.store.listId : undefined,
			'aria-activedescendant': ctx.opened.value ? selected.value || undefined : undefined,
			autoComplete,
			'data-expanded': ctx.opened.value || undefined,
			'data-stop-propagation': ctx.opened.value || undefined,
		}
		: {})
}
