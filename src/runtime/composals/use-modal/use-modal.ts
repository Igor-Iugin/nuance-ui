import { computed } from 'vue'

import { $modals } from './modal-manager'


/**
 * Composable for use inside a modal component.
 * Binds the component to {@link ModalManager} by identifier.
 *
 * @example
 * ```ts
 * const { opened, resolve } = useModal<MyProps, string>('my-modal')
 * // template: <ModalRoot v-model:open="opened">
 * // on confirm: resolve('ok')
 * ```
 */
export function useModal<
	Props extends Record<string, unknown> = Record<string, unknown>,
	Resolve = unknown,
	Reject = unknown,
>(
	/**
	 * modal identifier
	 *
	 * must match the `id` passed to `$modals.create()`
	 */
	id: string,
) {
	const state = $modals.state<Props, Resolve, Reject>(id)
	const opened = computed({
		get: () => state.value.opened,
		set: (opened: boolean) => opened
			? $modals.show(id, state.value.props)
			: $modals.reject(id),
	})

	if (!state)
		throw new Error(`Modal ${id} is not exist`)

	return {
		/**
		 * Two-way binding for `v-model:open`.
		 *
		 * Setting to `true` reopens the modal, setting to `false` calls `reject`
		 */
		opened,
		/** closes the modal and resolves the promise */
		resolve: (reason: Resolve) => $modals.hide(id, reason),
	}
}
