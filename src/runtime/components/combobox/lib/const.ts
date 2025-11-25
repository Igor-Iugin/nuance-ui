export interface ComboboxAttrs {
	selected: string
	option: string
	disabled: string
	active: string
}

export const COMBOBOX_ATTRS: ComboboxAttrs = {
	selected: 'data-combobox-selected',
	option: 'data-combobox-option',
	disabled: 'data-combobox-disabled',
	active: 'data-combobox-active',
}
