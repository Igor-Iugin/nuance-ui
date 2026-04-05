export interface DialogEmits {
	/** Event handler called when the dialog open */
	open: []
	/** Event handler called when the dialog closed */
	close: []
}

export interface DialogModel {
	open: boolean
}
