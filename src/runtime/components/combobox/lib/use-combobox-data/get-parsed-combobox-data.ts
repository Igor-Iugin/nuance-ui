import { isNumber } from 'es-toolkit'

import type {
	ComboboxData,
	ComboboxItem,
	ComboboxItemExt,
	ComboboxOption,
} from '../../types'

import { isOptionsGroup } from '../utils'


function parseItem<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(
	item: number | ComboboxOption<Value, Ext>,
): ComboboxOption<Value, Ext> {
	if (isNumber(item))
		return { value: item.toString(), label: item.toString() } as ComboboxItem<Value, Ext>

	if (isOptionsGroup(item)) {
		return {
			group: item.group,
			items: item.items.map(i => parseItem<Value, Ext>(i) as ComboboxItem<Value, Ext>),
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
): ComboboxOption<Value, Ext>[] {
	if (!data)
		return []

	return data.map(item => parseItem(item as ComboboxItem<Value, Ext>))
}
