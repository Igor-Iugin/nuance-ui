import type { MaybeRefOrGetter, ModelRef } from 'vue'

import { useTemplateRefsList } from '@vueuse/core'
import { computed, ref, toValue } from 'vue'

import { createPinArray } from './lib'


export function usePinInput<Element extends HTMLInputElement>({
	value: model,
	length,
	allowedKeys = ['Backspace', 'Tab', 'Control', 'Delete', 'ArrowLeft', 'ArrowRight'],
	manageFocus = true,
	inputMode,
}: {
	value: ModelRef<string>
	/** current length */
	length: MaybeRefOrGetter<number>
	/** @default ['Backspace', 'Tab', 'Control', 'Delete', 'ArrowLeft', 'ArrowRight'] */
	allowedKeys?: string[]
	/** @default true */
	manageFocus?: boolean
	inputMode: MaybeRefOrGetter<'numeric' | 'text'>
}) {
	const refs = useTemplateRefsList<Element>()
	const focusedIx = ref(-1)

	const cells = computed<string[]>({
		get: () => createPinArray(toValue(length), model.value),
		set: value => {
			model.value = value.join('').trim()
		},
	})

	function setFieldValue(value: string, ix: number) {
		const values = [...cells.value]
		values[ix] = value
		cells.value = values
		return values
	}

	function focus(dir: 'next' | 'prev', ix: number) {
		if (dir === 'next') {
			const nextIx = ix + 1
			if (nextIx < toValue(length))
				refs.value[nextIx]?.focus()
		}
		else if (dir === 'prev') {
			const prevIx = ix - 1
			if (prevIx >= 0)
				refs.value[prevIx]?.focus()
		}
	}

	function handleKeydown(
		event: KeyboardEvent,
		ix: number,
	) {
		const inputValue = (event.target as HTMLInputElement).value

		if (inputMode === 'numeric') {
			const isModifierShortcut = event.ctrlKey || event.metaKey
			const isAllowedKey = allowedKeys.includes(event.key)
				|| isModifierShortcut
				|| !Number.isNaN(Number(event.key))

			if (!isAllowedKey)
				return event.preventDefault()
		}

		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault()
				focus('prev', ix)
				break

			case 'ArrowRight':
				event.preventDefault()
				focus('next', ix)
				break

			case 'Tab':
				if (event.shiftKey && ix > 0 && manageFocus) {
					event.preventDefault()
					focus('prev', ix)
				}
				break

			case ' ':
				event.preventDefault()
				focus('next', ix)
				break

			case 'Delete':
				event.preventDefault()
				setFieldValue('', ix)
				break

			case 'Backspace':
				if (inputValue === '') {
					event.preventDefault()
					focus('prev', ix)
				}
				else {
					setFieldValue('', ix)
					if (ix < toValue(length) - 1) {
						event.preventDefault()
						focus('prev', ix)
					}
				}
				break

			default:
				if (inputValue.length > 0 && event.key === cells.value[ix]) {
					event.preventDefault()
					focus('next', ix)
				}
		}
	}

	return {
		refs,
		cells,
		focusedIx,
		focus,
		handleKeydown,
		setFieldValue,
	}
}
