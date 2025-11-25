import { computed } from 'vue'

import type { ComboboxData, ComboboxItem, ComboboxItemExt, ComboboxParsedItem } from '../../types'

import { getParsedComboboxData } from './get-parsed-combobox-data'


export function getOptionsLockup<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(options: ComboboxParsedItem<Value, Ext>[]): Record<string, ComboboxItem<Value, Ext>> {
	return options.reduce<Record<string, ComboboxItem<Value, Ext>>>((acc, item) => {
		if ('group' in item)
			return { ...acc, ...getOptionsLockup(item.items) }

		acc[(item as any).value] = item

		return acc
	}, {})
}

export function getLabelsLockup<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(options: ComboboxParsedItem<Value, Ext>[]): Record<string, string> {
	return options.reduce<Record<string, string>>((acc, item) => {
		if ('group' in item)
			return { ...acc, ...getLabelsLockup(item.items) }

		acc[(item as any).label] = item as any

		return acc
	}, {})
}

export function useComboboxData<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(data: ComboboxData<Value, Ext>) {
	const parsed = computed(() => getParsedComboboxData<Value, Ext>(data))
	const options = computed(() => getOptionsLockup<Value, Ext>(parsed.value))
	return { parsed, options }
}
