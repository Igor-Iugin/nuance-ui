import type { ComboboxItemGroup, ComboboxOption } from '../../types'


export function isEmptyComboboxData(data: ComboboxOption[]) {
	if (data.length === 0)
		return true

	for (const item of data) {
		if (!('group' in item))
			return false

		if ((item as ComboboxItemGroup).items.length > 0)
			return false
	}

	return true
}
