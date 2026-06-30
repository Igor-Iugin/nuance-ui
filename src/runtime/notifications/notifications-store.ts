import { markRaw, reactive } from 'vue'

import type { NotificationData, NotificationInput, NotificationsState } from './types'

import { createId } from './lib'


const GLOBAL_KEY = '__nui_notifications_store__'

declare const globalThis: Record<string, unknown>

/**
 * Global notifications store.
 *
 * Holds a reactive list of visible notifications plus an overflow queue.
 * Shows, updates, and removes notifications from any context.
 */
export class NotificationsStore {
	readonly state = reactive<NotificationsState>({
		notifications: [],
		queue: [],
		limit: 5,
		defaultPosition: 'bottom-right',
	})

	static get instance(): NotificationsStore {
		if (!globalThis[GLOBAL_KEY])
			globalThis[GLOBAL_KEY] = new NotificationsStore()

		return globalThis[GLOBAL_KEY] as NotificationsStore
	}

	/** Shows a notification, or queues it past the limit. Returns its id. */
	show(data: NotificationInput): string {
		const id = data.id ?? createId()
		const next: NotificationData = { ...data, id }

		const visibleIndex = this.state.notifications.findIndex(n => n.id === id)
		if (visibleIndex !== -1) {
			this.state.notifications[visibleIndex] = next
			return id
		}

		const queuedIndex = this.state.queue.findIndex(n => n.id === id)
		if (queuedIndex !== -1) {
			this.state.queue[queuedIndex] = next
			return id
		}

		if (this.state.notifications.length < this.state.limit)
			this.state.notifications.push(next)
		else
			this.state.queue.push(next)

		return id
	}

	/** Removes a notification and promotes the next queued one. */
	hide(id: string): void {
		const index = this.state.notifications.findIndex(n => n.id === id)
		if (index === -1) {
			this.state.queue = this.state.queue.filter(n => n.id !== id)
			return
		}

		this.state.notifications.splice(index, 1)

		const next = this.state.queue.shift()
		if (next)
			this.state.notifications.push(next)
	}

	/** Patches an existing notification in place. No-op if absent. */
	update(id: string, data: Partial<NotificationInput>): void {
		const visible = this.state.notifications.find(n => n.id === id)
		if (visible) {
			Object.assign(visible, data, { id })
			return
		}

		const queued = this.state.queue.find(n => n.id === id)
		if (queued)
			Object.assign(queued, data, { id })
	}

	/** Removes everything. */
	clean(): void {
		this.state.notifications = []
		this.state.queue = []
	}

	/** Removes only queued notifications. */
	cleanQueue(): void {
		this.state.queue = []
	}

	/** Patches store state (limit / defaultPosition). */
	updateState(fn: (state: NotificationsState) => NotificationsState): void {
		const next = fn(this.state)
		this.state.notifications = next.notifications
		this.state.queue = next.queue
		this.state.limit = next.limit
		this.state.defaultPosition = next.defaultPosition
	}
}

export const $notifications = markRaw(NotificationsStore.instance)
