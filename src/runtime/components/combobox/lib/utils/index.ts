export * from './default-option-filter'
export { isEmptyComboboxData } from './is-empty-combobox-data'
export { isOptionsGroup } from './is-guards'


export function isValueChecked(
	value: string | string[] | null | undefined,
	optionValue: string,
): boolean {
	return Array.isArray(value)
		? value.includes(optionValue)
		: value === optionValue
}
