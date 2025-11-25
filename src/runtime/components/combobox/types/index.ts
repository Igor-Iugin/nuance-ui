import type { ComboboxItem, ComboboxItemExt, ComboboxItemGroup } from './item'


export type ComboboxDropdownEventSource = 'keyboard' | 'mouse' | 'unknown'

export type ComboboxData<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> = (ComboboxItem<Value, Ext> | ComboboxItemGroup<Value, Ext>)[]

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
	withCheckIcon?: boolean
	checkIcon?: string
	iconPosition?: 'left' | 'right'
}

export * from './item'
