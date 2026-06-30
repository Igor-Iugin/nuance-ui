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
	// `reactive<NotificationsState>` deep-unwraps NotificationData (Button/Box props)
	// and trips TS2589. Build the reactive object plainly, then surface it as the
	// plain state shape — the runtime is still fully reactive.
	readonly state = reactive({
		notifications: [] as NotificationData[],
		queue: [] as NotificationData[],
		limit: 5,
		defaultPosition: 'bottom-right' as NotificationsState['defaultPosition'],
	}) as NotificationsState

	private constructor() {}

	static get instance(): NotificationsStore {
		if (!globalThis[GLOBAL_KEY])
			globalThis[GLOBAL_KEY] = new NotificationsStore()

		return globalThis[GLOBAL_KEY] as NotificationsStore
	}

	/** Shows a notification, or queues it past the limit. Returns its id. */
	show(data: NotificationInput): string {
		const id = data.id ?? createId()
		const next: NotificationData = { ...data, id }

		const visible = this.state.notifications.find(n => n.id === id)
		if (visible) {
			Object.assign(visible, data, { id })
			return id
		}

		const queued = this.state.queue.find(n => n.id === id)
		if (queued) {
			Object.assign(queued, data, { id })
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
			const queuedIndex = this.state.queue.findIndex(n => n.id === id)
			if (queuedIndex !== -1)
				this.state.queue.splice(queuedIndex, 1)
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
		this.state.notifications.splice(0)
		this.state.queue.splice(0)
	}

	/** Removes only queued notifications. */
	cleanQueue(): void {
		this.state.queue.splice(0)
	}

	/** Patches store configuration (limit / defaultPosition). */
	updateState(patch: Partial<Pick<NotificationsState, 'limit' | 'defaultPosition'>>): void {
		if (patch.limit !== undefined)
			this.state.limit = patch.limit

		if (patch.defaultPosition !== undefined)
			this.state.defaultPosition = patch.defaultPosition
	}
}

export const $notifications = markRaw(NotificationsStore.instance)
