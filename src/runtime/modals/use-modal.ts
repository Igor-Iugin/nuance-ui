import { computed } from 'vue'

import { $modals } from './modal-manager'


/**
 * Binds a modal component to the global modal manager by identifier.
 *
 * The `id` must match the one passed to `$modals.create()`.
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
	const state = computed(() => $modals.state<Props, Resolve, Reject>(id))
	const opened = computed({
		get: () => state.value?.opened,
		set: (opened: boolean) => opened
			? $modals.show(id, state.value.props)
			: $modals.reject(id, 'cancel'),
	})

	if (!state)
		throw new Error(`Modal ${id} is not exist`)

	return {
		/** Two-way binding for `v-model:open`. Setting to `false` rejects the promise. */
		opened,
		/** Closes the modal and resolves its promise with the given value. */
		resolve: (reason: Resolve) => $modals.resolve(id, reason),
		/** Closes the modal and rejects its promise. */
		reject: () => $modals.reject(id),
	}
}
