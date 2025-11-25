interface BaseComboboxFields {
	value: string
	label: string
	disabled?: boolean
	icon?: string
}

export type ComboboxItemExt = Omit<object, keyof BaseComboboxFields>

export type ComboboxItem<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> = BaseComboboxFields & { value: Value } & Ext

export interface ComboboxParsedItemGroup<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> {
	group: string
	icon?: string
	items: ComboboxItem<Value, Ext>[]
}

export type ComboboxParsedItem<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> = ComboboxItem<Value, Ext> | ComboboxParsedItemGroup<Value, Ext>

export interface ComboboxItemGroup<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> {
	group: string
	icon?: string
	items: ComboboxItem<Value, Ext>[]
}
