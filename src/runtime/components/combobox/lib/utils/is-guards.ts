import type { ComboboxItemExt, ComboboxItemGroup, ComboboxOption } from '../../types'


export function isOptionsGroup<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(item: ComboboxOption<Value, Ext>): item is ComboboxItemGroup<Value, Ext> {
	return 'group' in item
}
