import type {
	ComboboxData,
	ComboboxItem,
	ComboboxItemExt,
	ComboboxItemGroup,
	ComboboxParsedItem,
	ComboboxParsedItemGroup,
} from '../../types'

import { isOptionsGroup } from '../utils'


function parseItem<Value extends string = string, Ext extends ComboboxItemExt = object>(
	item: number | ComboboxItem<Value, Ext> | ComboboxItemGroup<Value, Ext>,
): ComboboxItem<Value, Ext> | ComboboxParsedItemGroup<Value, Ext> {
	if (typeof item === 'number')
		return { value: item.toString(), label: item.toString() } as ComboboxItem<Value, Ext>

	if (isOptionsGroup(item)) {
		return {
			group: item.group,
			items: item.items.map(i => parseItem(i) as ComboboxItem<Value, Ext>),
		}
	}

	if ('value' in item && !('label' in item)) {
		return {
			...(item as ComboboxItem<Value, Ext>),
			label: (item as ComboboxItem<Value, Ext>).value,
		}
	}

	return item
}

export function getParsedComboboxData<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(
	data: ComboboxData<Value, Ext> | undefined,
): ComboboxParsedItem<Value, Ext>[] {
	if (!data)
		return []

	return data.map(item => parseItem(item as ComboboxItem<Value, Ext>))
}
