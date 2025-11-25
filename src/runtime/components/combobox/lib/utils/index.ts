import type { ComboboxItem, ComboboxItemExt } from '../../model'


export * from './default-option-filter'
export { isEmptyComboboxData } from './is-empty-combobox-data'
export { isOptionsGroup } from './is-options-group'


export function isValueChecked<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(value: ComboboxItem<Value, Ext> | ComboboxItem<Value, Ext>[] | undefined | null, optionValue: ComboboxItem<Value, Ext>) {
	return Array.isArray(value)
		? value.some(({ value }) => value === optionValue.value)
		: value?.value === optionValue.value
}
