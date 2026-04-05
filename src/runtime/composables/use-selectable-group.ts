import type { ModelRef } from 'vue'


export interface UseSelectableGroupOptions {
	/** When `true`, the value cannot be changed. */
	readOnly?: boolean
	/** When `true`, all items in the group are disabled. */
	disabled?: boolean
	/** Maximum number of items that can be selected. When reached, unselected items become disabled. */
	maxSelectedValues?: number
}

export interface UseSelectableGroupReturn<T> {
	/** Toggles the given value in the selection array. */
	update: (value: T) => void
	/** Returns `true` when the value is currently selected. */
	isSelected: (value: T) => boolean
	/** Returns `true` when an item with the given value should be disabled. */
	isDisabled: (value: T) => boolean
}

/**
 * Shared selection logic for multi-select group components.
 *
 * Centralizes the add/remove, max-limit and read-only rules.
 */
export function useSelectableGroup<T extends string = string>(
	value: ModelRef<T[]>,
	options: UseSelectableGroupOptions = {},
): UseSelectableGroupReturn<T> {
	const isSelected = (item: T) => value.value.includes(item)

	const update = (item: T) => {
		if (options.readOnly)
			return

		const selected = isSelected(item)

		if (!selected
			&& options.maxSelectedValues !== undefined
			&& value.value.length >= options.maxSelectedValues) {
			return
		}

		value.value = selected
			? value.value.filter(i => i !== item)
			: [...value.value, item]
	}

	const isDisabled = (item: T) => {
		if (options.disabled)
			return true

		if (options.maxSelectedValues === undefined)
			return false

		return !isSelected(item) && value.value.length >= options.maxSelectedValues
	}

	return { update, isSelected, isDisabled }
}
