export interface DialogEmits {
	/** Event handler called when the dialog open */
	open: []
	/** Event handler called when the dialog closed */
	close: []
}

export interface DialogModel {
	/** Controls open/closed state */
	open: boolean
}
