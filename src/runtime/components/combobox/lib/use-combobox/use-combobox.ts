import type { ModelRef, ShallowRef } from 'vue'

import { unrefElement } from '@vueuse/core'
import { nextTick, shallowRef, useId } from 'vue'

import type { ComboboxDropdownEventSource } from '../../types'
import type { ComboboxAttrs } from '../const'

import { COMBOBOX_ATTRS } from '../const'
import {
	clearSelected,
	selectActiveOption,
	selectFirstOption,
	selectNextOption,
	selectOption,
	selectPrevOption,
	updateSelectedOptionIx,
} from './handlers'


export interface ComboboxStore {
	/** Id passed to dropdown */
	listId: string

	/** Opens dropdown */
	openDropdown: (eventSource?: ComboboxDropdownEventSource) => void

	/** Closes dropdown */
	closeDropdown: (eventSource?: ComboboxDropdownEventSource) => void

	/** Toggles dropdown opened state */
	toggleDropdown: (eventSource?: ComboboxDropdownEventSource) => void

	/** Returns currently selected option index or `-1` if none of the options is selected */
	getSelectedOptionIx: () => number

	/** Selects `Combobox.Option` by index */
	selectOption: (index: number) => void

	/**
	 * Selects first `Combobox.Option` with `active` prop.
	 *  If there are no such options, the function does nothing.
	 */
	selectActiveOption: () => string | null

	/**
	 * Selects first `Combobox.Option` that is not disabled.
	 *  If there are no such options, the function does nothing.
	 */
	selectFirstOption: () => string | null

	/**
	 * Selects next `Combobox.Option` that is not disabled.
	 *  If the current option is the last one, the function selects first option, if `loop` is true.
	 */
	selectNextOption: () => string | null

	/**
	 * Selects previous `Combobox.Option` that is not disabled.
	 *  If the current option is the first one, the function selects last option, if `loop` is true.
	 */
	selectPrevOption: () => string | null

	/** Resets selected option index to -1, removes `data-combobox-selected` from selected option */
	resetSelectedOption: () => void

	/**
	 * Triggers `onClick` event of selected option.
	 *  If there is no selected option, the function does nothing.
	 */
	clickSelectedOption: () => void

	/**
	 * Updates selected option index to currently selected or active option.
	 *  The function is required to be used with searchable components to update selected option index
	 *  when options list changes based on search query.
	 */
	updateSelectedOptionIx: (
		target?: 'active' | 'selected',
		options?: { scrollIntoView?: boolean },
	) => void

	/** Ref of `Combobox.Search` input */
	searchRef: ShallowRef<HTMLInputElement | null>

	/** Moves focus to `Combobox.Search` input */
	focusSearch: () => void

	/** Ref of the target element */
	targetRef: ShallowRef<HTMLElement | null>

	/** Moves focus to the target element */
	focusTarget: () => void
}

export function useCombobox({ onSelect, onClear, onCloseDropdown, onOpenDropdown, opened, ..._options }: {
	attrs?: ComboboxAttrs
	scrollBehavior?: ScrollBehavior
	loop?: boolean
	onSelect?: (ix: number) => void
	onClear?: () => void
	onOpenDropdown?: (eventSource: ComboboxDropdownEventSource) => void
	onCloseDropdown?: (eventSource: ComboboxDropdownEventSource) => void
	opened: ModelRef<boolean>
}): ComboboxStore {
	const listId = useId()
	const targetRef = shallowRef<HTMLElement | null>(null)
	const searchRef = shallowRef<HTMLInputElement | null>(null)

	const openDropdown: ComboboxStore['openDropdown'] = (eventSource = 'unknown') => {
		if (!opened.value) {
			opened.value = true
			onOpenDropdown?.(eventSource)
		}
	}

	const closeDropdown: ComboboxStore['closeDropdown'] = (eventSource = 'unknown') => {
		if (opened.value) {
			opened.value = false
			onCloseDropdown?.(eventSource)
		}
	}

	const toggleDropdown: ComboboxStore['toggleDropdown'] = (eventSource = 'unknown') => {
		if (opened.value)
			closeDropdown(eventSource)
		else
			openDropdown(eventSource)
	}

	const options = {
		attrs: _options?.attrs ?? COMBOBOX_ATTRS,
		scrollBehavior: _options?.scrollBehavior ?? 'instant',
		loop: _options?.loop ?? true,
		listId,
		selectFn: (ix: number) => ix ? `${ix}` : null,
	}
	let selectedOptionIx: number = -1
	const getSelectedIx = () => selectedOptionIx

	const clear = () => {
		clearSelected(options)
		onClear?.()
	}
	const select = (ix: number) => {
		const res = selectOption(ix, { ...options, clearFn: clear })
		if (res) {
			selectedOptionIx = res.ix
			onSelect?.(res.ix)
			return res.value
		}
		return null
	}
	options.selectFn = select

	const selectActive = () => selectActiveOption(options)
	const selectNext = () => selectNextOption(getSelectedIx(), options)
	const selectPrev = () => selectPrevOption(getSelectedIx(), options)
	const selectFirst = () => selectFirstOption(options)
	const updateSelectedIx = (target?: 'active' | 'selected') => updateSelectedOptionIx(target, options)

	const resetSelectedOption = () => {
		selectedOptionIx = -1
		clear()
	}

	const clickSelectedOption = () => {
		const items = document.querySelectorAll<HTMLElement>(`#${options.listId} [${options.attrs.option}]`)
		const item = items?.[selectedOptionIx]
		item?.click()
	}

	const focusSearch = () => {
		nextTick(() => unrefElement(searchRef)?.focus())
	}
	const focusTarget = () => {
		nextTick(() => unrefElement(targetRef)?.focus())
	}

	return {
		listId,
		openDropdown,
		closeDropdown,
		toggleDropdown,

		selectOption: select,
		selectActiveOption: selectActive,
		selectNextOption: selectNext,
		selectPrevOption: selectPrev,
		selectFirstOption: selectFirst,

		resetSelectedOption,
		clickSelectedOption,
		getSelectedOptionIx: getSelectedIx,

		targetRef,
		focusTarget,

		searchRef,
		focusSearch,
		updateSelectedOptionIx: updateSelectedIx,
	}
}
