interface BaseComboboxFields {
	value: string
	label: string
	disabled?: boolean
	icon?: string
}

/** Extra fields allowed on a combobox item beyond the base fields */
export type ComboboxItemExt = Omit<object, keyof BaseComboboxFields>

/** Single selectable option */
export type ComboboxItem<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> = BaseComboboxFields & { value: Value } & Ext

/** Grouped set of combobox items */
export interface ComboboxItemGroup<
	_Value extends string = string,
	Ext extends ComboboxItemExt = object,
> {
	/** Group label */
	group: string
	/** Group icon */
	icon?: string
	// TODO Need fix inferring types
	items: ComboboxItem<any, Ext>[]
}

/** A flat item or a group of items */
export type ComboboxOption<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> = ComboboxItem<Value, Ext> | ComboboxItemGroup<Value, Ext>

/** Full list of combobox options */
export type ComboboxData<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> = ComboboxOption<Value, Ext>[]


/** Source that triggered a dropdown open/close event */
export type ComboboxDropdownEventSource = 'keyboard' | 'mouse' | 'unknown'

export interface ComboboxRootEmits {
	clear: []
	select: [number]

	/** Called when dropdown opens with event source: keyboard, mouse or unknown */
	open: [ComboboxDropdownEventSource]

	/** Called when dropdown closes with event source: keyboard, mouse or unknown */
	close: [ComboboxDropdownEventSource]

	/** Called when item is selected with the `Enter` key or by clicking it */
	submit: [string, ComboboxItem]
}

export interface ComboboxItemProps {
	/** Shows a check icon next to the selected option */
	withCheckIcon?: boolean
	/** Icon name for the check mark */
	checkIcon?: string
	/** Position of the check icon relative to the label */
	iconPosition?: 'left' | 'right'
}
