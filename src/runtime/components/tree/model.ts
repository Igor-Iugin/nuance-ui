export interface TreeModels<T extends string = string> {
	selected: T[]
	expanded: T[]
}

export interface TreeItem<T extends string = string> {
	/** @IconifyIcon */
	icon?: string
	/** Value given to this item */
	value: T
	/** Item label */
	label?: string
	/** @IconifyIcon */
	trailingIcon?: string
	/** Item default expanded */
	expanded?: boolean
	/** Item disabled state */
	disabled?: boolean
	/** Slot name */
	slot?: string
	/** Item children */
	children?: TreeItem<T>[]
	/** Fires when item is selected */
	onSelect?: (item: TreeItem<T>) => void
	/** Fires when item is toggled */
	onToggle?: (item: TreeItem<T>) => void
}
