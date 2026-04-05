import { computed } from 'vue'

import type { ComboboxData, ComboboxItem, ComboboxItemExt, ComboboxOption } from '../../types'

import { isOptionsGroup } from '../utils'
import { getParsedComboboxData } from './get-parsed-combobox-data'


export function getOptionsLockup<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(options: ComboboxOption<Value, Ext>[]): Record<string, ComboboxItem<Value, Ext>> {
	return options.reduce<Record<string, ComboboxItem<Value, Ext>>>((acc, item) => {
		if (isOptionsGroup(item))
			return { ...acc, ...getOptionsLockup(item.items) }

		acc[item.value] = item

		return acc
	}, {})
}

export function getLabelsLockup<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(options: ComboboxOption<Value, Ext>[]): Record<string, ComboboxOption<Value, Ext>> {
	return options.reduce<Record<string, ComboboxOption<Value, Ext>>>((acc, item) => {
		if (isOptionsGroup(item))
			return { ...acc, ...getLabelsLockup(item.items) }

		acc[item.label] = item

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
