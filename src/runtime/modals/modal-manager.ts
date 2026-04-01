import type { Component } from 'vue'

import { markRaw, reactive } from 'vue'


/**
 * Reactive state of a single modal within the modal manager.
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

// ─── Module-scope state ───

/** Reactive map of active modals */
const modals = reactive<Map<string, ModalState>>(new Map())
/** Eagerly registered components (id → Component) */
const registered = new Map<string, Component>()
/** Lazily registered loaders (id → loader) */
const lazy = new Map<string, () => Promise<{ default: Component }>>()

// ─── Private helpers ───

async function show<T = unknown>(id: string, props: object = {}): Promise<T> {
	if (!registered.has(id) && lazy.has(id)) {
		const loader = lazy.get(id)!
		try {
			const loaded = await loader()
			registered.set(id, loaded.default)
		}
		catch (err) {
			return Promise.reject(err)
		}
	}

	const component = registered.get(id)
	if (!component)
		return Promise.reject(new Error(`Modal "${id}" is not registered`))

	const existing = modals.get(id)

	return new Promise<T>((resolve, reject) => {
		if (existing) {
			existing.props = props
			existing.opened = true
			existing.resolve = resolve as (value?: any) => void
			existing.reject = reject
		}
		else {
			modals.set(id, {
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

// ─── Public API ───

/**
 * Registers a modal component and returns a typed function to open it.
 */
function create<
	TProps extends object = object,
	TResult = void,
>(
	/** unique modal identifier */
	id: string,
	/** Vue component for the modal */
	component: Component,
): (props?: TProps) => Promise<TResult> {
	registered.set(id, component)
	return (props?: TProps) => show<TResult>(id, props ?? {})
}

/**
 * Registers a lazy modal — the component is loaded on first open.
 */
function createLazy<
	TProps extends object = object,
	TResult = void,
>(
	/** unique modal identifier */
	id: string,
	/** dynamic import function (`() => import('./my-modal.vue')`) */
	loader: () => Promise<{ default: Component }>,
): (props?: Omit<TProps, 'modalId'>) => Promise<TResult> {
	lazy.set(id, loader)
	return (props?: Omit<TProps, 'modalId'>) => show<TResult>(id, props ?? {})
}

/**
 * Closes the modal and resolves its promise with the given result.
 */
function resolve(id: string, result?: any): void {
	const modal = modals.get(id)
	if (!modal)
		return

	modal.opened = false
	modal.resolve?.(result)
}

/**
 * Closes the modal and rejects its promise with the given reason.
 */
function reject(id: string, reason?: any): void {
	const modal = modals.get(id)
	if (!modal)
		return

	modal.opened = false
	modal.reject?.(reason)
}

/**
 * Returns the reactive state of a specific modal.
 * Used inside a modal component (via {@link useModal}).
 */
function state<
	Props extends object = object,
	Resolve = unknown,
	Reject = unknown,
>(
	id: string,
) {
	return modals.get(id) as ModalState<Props, Resolve, Reject>
}

/**
 * Modal manager.
 *
 * Maintains a component registry and a reactive map of active modals.
 * Opening a modal returns a `Promise` that resolves via `resolve`
 * or rejects via `reject` / user dismissal.
 *
 * @example
 * ```ts
 * const open = $modals.create<MyProps, string>('my-modal', MyModal)
 * const result = await open({ foo: 'bar' }) // result: string
 * ```
 */
export const $modals = markRaw({
	modals,
	create,
	createLazy,
	show,
	resolve,
	reject,
	state,
})
