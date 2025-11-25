import type { ComboboxItem, ComboboxItemExt, ComboboxParsedItem } from '../../model'

import { isOptionsGroup } from './is-options-group'


export interface FilterOptionsInput<Value extends string = string, Ext extends ComboboxItemExt = object> {
	options: ComboboxParsedItem<Value, Ext>[]
	search: string
	limit: number
}

export function defaultOptionsFilter<Value extends string = string, Ext extends ComboboxItemExt = object>({
	options,
	search,
	limit,
}: FilterOptionsInput<Value, Ext>): ComboboxParsedItem<Value, Ext>[] {
	const parsedSearch = search.trim().toLowerCase()
	const result: ComboboxParsedItem<Value, Ext>[] = []

	for (let i = 0; i < options.length; i += 1) {
		const item = options[i]!

		if (result.length === limit)
			return result

		if (isOptionsGroup(item)) {
			result.push({
				group: item.group,
				items: defaultOptionsFilter({
					options: item.items,
					search,
					limit: limit - result.length,
				}) as ComboboxItem<Value, Ext>[],
			})
		}

		if (!isOptionsGroup(item) && item.label.toLowerCase().includes(parsedSearch))
			result.push(item)
	}

	return result
}
