import type { Component } from 'vue'

import { markRaw, reactive } from 'vue'


/**
 * Reactive state of a single modal within {@link ModalManager}.
 */
export interface ModalState<
	Props extends object = object,
	Resolve = unknown,
	Reject = unknown,
> {
	/** Unique modal identifier */
	id: string
	/** Vue component rendered as the modal */
	component: Component
	/** Props passed when calling `show` or the opener function */
	props: Props
	/** Current visibility state */
	opened: boolean
	/** Resolves the promise created when the modal was opened */
	resolve: (value?: Resolve) => void
	/** Rejects the promise created when the modal was opened */
	reject: (reason?: Reject) => void
}

/**
 * Modal manager.
 *
 * Maintains a component registry and a reactive map of active modals.
 * Opening a modal returns a `Promise` that resolves via `hide`
 * or rejects via `reject` / user dismissal.
 *
 * @example
 * ```ts
 * const open = $modals.create<MyProps, string>('my-modal', MyModal)
 * const result = await open({ foo: 'bar' }) // result: string
 * ```
 */
export class ModalManager {
	/** Reactive map of active modals */
	readonly #modals = reactive<Map<string, ModalState>>(new Map())
	/** Eagerly registered components (id → Component) */
	readonly #registered = new Map<string, Component>()
	/** Lazily registered loaders (id → loader) */
	readonly #lazy = new Map<string, () => Promise<{ default: Component }>>()

	/** Reactive map of all active modals. Used by `ModalProvider` for rendering */
	get modals() {
		return this.#modals
	}

	// ── Facade ──

	/**
	 * Registers a modal component and returns a typed function to open it.
	 */
	create<
		TProps extends object = object,
		TResult = void,
	>(
		/** unique modal identifier */
		id: string,
		/** Vue component for the modal */
		component: Component,
	): (props?: TProps) => Promise<TResult> {
		this.#registered.set(id, component)
		return (props?: TProps) => this.#show<TResult>(id, props ?? {})
	}

	/**
	 * Registers a lazy modal — the component is loaded on first open.
	 */
	createLazy<
		TProps extends object = object,
		TResult = void,
	>(
		/** unique modal identifier */
		id: string,
		/** dynamic import function (`() => import('./my-modal.vue')`) */
		loader: () => Promise<{ default: Component }>,
	): (props?: Omit<TProps, 'modalId'>) => Promise<TResult> {
		this.#lazy.set(id, loader)
		return (props?: Omit<TProps, 'modalId'>) => this.#show<TResult>(id, props ?? {})
	}

	/**
	 * Opens a previously registered modal by its identifier.
	 */
	async show<T = unknown>(id: string, props: object = {}): Promise<T> {
		return this.#show(id, props)
	}

	/**
	 * Closes the modal and resolves its promise with the given result.
	 *
	 * @param id     — modal identifier
	 * @param result — value the promise resolves with
	 */
	resolve(id: string, result?: any): void {
		this.#resolve(id, result)
	}

	/**
	 * Closes the modal and rejects its promise with the given reason.
	 *
	 * @param id     — modal identifier
	 * @param reason — rejection reason
	 */
	reject(id: string, reason?: any): void {
		this.#reject(id, reason)
	}

	/**
	 * Returns the reactive state of a specific modal as `ComputedRef<ModalState>`.
	 *
	 * Used inside a modal component (via {@link useModal}).
	 */
	state<
		Props extends object = object,
		Resolve = unknown,
		Reject = unknown,
	>(
		id: string,
	) {
		return this.#modals.get(id) as ModalState<Props, Resolve, Reject>
	}

	// ── Private implementation ──

	async #show<T = unknown>(id: string, props: object = {}): Promise<T> {
		if (!this.#registered.has(id) && this.#lazy.has(id)) {
			const loader = this.#lazy.get(id)!
			try {
				const loaded = await loader()
				this.#registered.set(id, loaded.default)
			}
			catch (err) {
				return Promise.reject(err)
			}
		}

		const component = this.#registered.get(id)
		if (!component)
			return Promise.reject(new Error(`Modal "${id}" is not registered`))

		const existing = this.#modals.get(id)

		return new Promise<T>((resolve, reject) => {
			if (existing) {
				existing.props = props
				existing.opened = true
				existing.resolve = resolve as (value?: any) => void
				existing.reject = reject
			}
			else {
				this.#modals.set(id, {
					id,
					component: markRaw(component),
					props,
					opened: true,
					resolve: resolve as (value?: any) => void,
					reject,
				})
			}
		})
	}

	#resolve(id: string, result?: any): void {
		const modal = this.#modals.get(id)
		if (!modal)
			return

		modal.opened = false
		modal.resolve?.(result)
	}

	#reject(id: string, reason?: any): void {
		const modal = this.#modals.get(id)
		if (!modal)
			return

		modal.opened = false
		modal.reject?.(reason)
	}
}
