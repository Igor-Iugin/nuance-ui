import type { ModelRef } from 'vue'


export interface UseSelectableGroupOptions {
	/** If set, value cannot be changed */
	readOnly?: boolean
	/** If set, all items in the group are disabled */
	disabled?: boolean
	/** Maximum number of items that can be selected. When reached, unselected items become disabled */
	maxSelectedValues?: number
}

export interface UseSelectableGroupReturn<T> {
	/** Updates given value in the selection array (immutable update) */
	update: (value: T) => void
	/** Checks if given value is currently selected */
	isSelected: (value: T) => boolean
	/**
	 * Checks if an item with given value should be disabled.
	 * Returns `true` when the group is disabled or when `maxSelectedValues` is reached
	 * and the item is not already selected.
	 */
	isDisabled: (value: T) => boolean
}

/**
 * Shared logic for multi-select group components (CheckboxGroup, SwitchGroup, etc).
 *
 * Centralizes the add/remove/max-limit/read-only rules so each group component
 * does not have to re-implement them. Uses immutable updates (`[...value, item]`)
 * so that `defineModel` reactivity propagates correctly to children — mutating the
 * array via `.push()` does not trigger model updates.
 *
 * @param value - `defineModel` ref containing the array of selected values
 * @param options - Group-level options (disabled, readOnly, maxSelectedValues)
 *
 * @example
 * ```ts
 * const value = defineModel<string[]>({ default: [] })
 * const { toggle, isSelected, isDisabled } = useSelectableGroup(value, {
 *   disabled,
 *   readOnly,
 *   maxSelectedValues,
 * })
 * ```
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
