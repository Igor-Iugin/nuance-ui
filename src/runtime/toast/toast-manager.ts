import type { ShallowRef } from 'vue'

import { markRaw, shallowRef } from 'vue'

import type { ToastData, ToastPosition } from './types'


const GLOBAL_KEY = '__nui_toast_manager__'

declare const globalThis: Record<string, unknown>

class ToastManager {
	#toasts: ShallowRef<ToastData[]> = shallowRef([])
	#queue: ShallowRef<ToastData[]> = shallowRef([])
	#defaultPosition: ToastPosition = 'bottom-right'
	#limit: number = 5

	private constructor() {}

	static get instance(): ToastManager {
		if (!globalThis[GLOBAL_KEY])
			globalThis[GLOBAL_KEY] = new ToastManager()

		return globalThis[GLOBAL_KEY] as ToastManager
	}

	get toasts() {
		return this.#toasts
	}

	get queue() {
		return this.#queue
	}

	#getDistributedToasts(data: ToastData[]) {
		const queue: ToastData[] = []
		const toasts: ToastData[] = []
		const count = {} as Record<ToastPosition, number>

		for (const item of data) {
			const position = item.position || this.#defaultPosition
			count[position] = count[position] || 0
			count[position] += 1

			count[position] <= this.#limit
				? toasts.push(item)
				: queue.push(item)
		}

		return { toasts, queue }
	}

	#updateState(updateCb: (toasts: ToastData[]) => ToastData[]) {
		const toasts = updateCb([...this.#toasts.value, ...this.#queue.value])
		const updated = this.#getDistributedToasts(toasts)

		this.#toasts.value = updated.toasts
		this.#queue.value = updated.queue
	}


	#show(toast: ToastData): string {
		const id = toast?.id || crypto.randomUUID()

		this.#updateState(toasts => {
			if (toast.id && toasts.some(t => t.id === toast.id))
				return toasts

			return [...toasts, { ...toast, id }]
		})

		return id
	}

	#hide(id: string): string {
		this.#updateState(toasts => toasts.filter(toast => {
			if (toast.id !== id)
				return true

			toast?.onClose?.(toast)
			return false
		}))

		return id
	}

	#update(toast: ToastData) {
		this.#updateState(toasts => toasts.map(item => item.id === toast.id
			? { ...item, ...toast }
			: item))
		return toast.id
	}

	#clear() {
		this.#updateState(() => [])
	}

	#clearQueue() {
		this.#updateState(toasts => toasts.slice(0, this.#limit))
	}

	// ─── Facade ───

	/** Adds a toast. Returns the assigned id. */
	static show(toast: ToastData): string {
		return ToastManager.instance.#show(toast)
	}

	/** Removes a toast by id. Returns the id. */
	static hide(id: string): string {
		return ToastManager.instance.#hide(id)
	}

	/** Updates an existing toast by id. Returns the id. */
	static update(toast: ToastData) {
		return ToastManager.instance.#update(toast)
	}

	/** Removes all visible toasts and clears the queue. */
	static clear() {
		return ToastManager.instance.#clear()
	}

	/** Empties the queue, keeping visible toasts. */
	static clearQueue() {
		return ToastManager.instance.#clearQueue()
	}
}

export const $toast = markRaw(ToastManager.instance)
