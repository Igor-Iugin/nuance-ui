import type { StringOrVNode } from '@nui/types'

import type { ButtonProps } from '../components/button/button.vue'
import type { NotificationProps } from '../components/notification.vue'


/** Notification placement on screen. */
export type NotificationPosition
	= | 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'

/** Actions/close layout. */
export type NotificationOrientation = 'vertical' | 'horizontal'

/** Action button rendered inside a notification. */
export interface NotificationAction extends ButtonProps {
	/** Button label */
	label: string
	/** Click handler */
	onClick?: (event: MouseEvent) => void
}

/** Argument of `$notifications.show()`. */
export interface NotificationInput extends Omit<NotificationProps, 'title' | 'message'> {
	/** Stable id. Reusing an existing id updates that notification in place. */
	id?: string
	/** Notification title */
	title?: StringOrVNode
	/** Notification body */
	message?: StringOrVNode
	/** Action buttons */
	actions?: NotificationAction[]
	/** Actions/close layout @default 'vertical' */
	orientation?: NotificationOrientation
	/** Overrides the provider position */
	position?: NotificationPosition
	/** Auto-close in ms, or `false` to keep open. Overrides the provider value */
	autoClose?: number | false
	/** Called after the notification is removed */
	onClose?: (id: string) => void
	/** Called once when the notification mounts */
	onOpen?: (id: string) => void
}

/** Stored notification — always has an id. */
export interface NotificationData extends NotificationInput {
	id: string
}

/** Reactive store state. */
export interface NotificationsState {
	/** Currently visible notifications (<= limit) */
	notifications: NotificationData[]
	/** Notifications waiting for a free slot */
	queue: NotificationData[]
	/** Max visible at once */
	limit: number
	/** Position used when a notification has none */
	defaultPosition: NotificationPosition
}
