import type { ComboboxItemExt, ComboboxParsedItem, ComboboxParsedItemGroup } from '../../model'


export function isOptionsGroup<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
>(item: ComboboxParsedItem<Value, Ext>): item is ComboboxParsedItemGroup<Value, Ext> {
	return 'group' in item
}
