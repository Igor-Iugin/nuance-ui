import type { Slot } from 'vue'


type Vertical = 'top' | 'bottom'
type Horizontal = 'left' | 'center' | 'right'

export type ToastPosition = `${Vertical}-${Horizontal}`

export interface ToastData {
	id?: string

	/** Position of the toast. @default 'bottom-left' */
	position?: ToastPosition

	/** Toast message */
	message: string | Slot

	/** Called when toast closes */
	onClose?: (props: ToastData) => void

	/** Called when toast opens */
	onOpen?: (props: ToastData) => void

	/** Determines whether toast should be closed automatically, number is auto close timeout in ms */
	autoClose?: number | boolean
}
