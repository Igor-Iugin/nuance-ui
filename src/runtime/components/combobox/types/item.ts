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

export interface ComboboxItemGroup<
	_Value extends string = string,
	Ext extends ComboboxItemExt = object,
> {
	group: string
	icon?: string
	// TODO Need fix inferring types
	items: ComboboxItem<any, Ext>[]
}

export type ComboboxOption<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> = ComboboxItem<Value, Ext> | ComboboxItemGroup<Value, Ext>
