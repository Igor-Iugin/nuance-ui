import type { InjectionKey } from '@vue/runtime-core'
import type { CreateInjectionStateOptions } from '@vueuse/core'

import { createInjectionState } from '@vueuse/core'


interface StrictInjectionOptions<Return> extends Omit<CreateInjectionStateOptions<Return>, 'injectionKey'> {
	/**
	 * The name of the context for error messages.
	 * Used to generate helpful error when context is missing.
	 *
	 * @example 'ComboboxState', 'FormContext', 'DialogProvider'
	 */
	name: string
	injectionKey: InjectionKey<Return>
}

type StrictInjectionReturn<Arguments extends Array<any>, Return> = Readonly<[
	/**
	 * Provider function to be called in a parent component.
	 * Creates and provides the state to all descendant components.
	 *
	 * @param args - Arguments passed to the composable function
	 * @returns The state returned by the composable
	 *
	 * @example
	 * ```vue
	 * <script setup>
	 * const state = useProvideComboboxState({ items: [] })
	 * </script>
	 * ```
	 */
	useProvidingState: (...args: Arguments) => Return,

	/**
	 * Consumer function to be called in a child component.
	 * Injects the state provided by the nearest parent provider.
	 *
	 * @throws {Error} When called outside of a provider context
	 * @returns The injected state
	 *
	 * @example
	 * ```vue
	 * <script setup>
	 * const state = useComboboxState() // Throws if no provider found
	 * </script>
	 * ```
	 */
	useInjectedState: () => Return,
]>

/**
 * Creates a pair of composables for strict provide/inject pattern with required context.
 * Unlike Vue's standard inject, this ensures the context is always provided, throwing an error otherwise.
 *
 * This is useful for component libraries where certain child components must be used
 * within a specific parent component context.
 *
 * @template Arguments - The arguments accepted by the composable function
 * @template Return - The return type of the composable function
 *
 * @param composable - The composable function that creates the shared state
 * @param options - Configuration options including context name for error messages
 *
 * @returns A tuple of [useProvidingState, useInjectedState] functions
 *
 * @example
 * ```ts
 * // Define the state structure
 * interface ComboboxState {
 *   items: string[]
 *   selected: Ref<string | null>
 * }
 *
 * // Create the strict injection pair
 * const [useProvideComboboxState, useComboboxState] = createStrictInjection(
 *   (state: ComboboxState) => {
 *     return {
 *       ...state,
 *       select: (item: string) => { state.selected.value = item }
 *     }
 *   },
 *   { name: 'ComboboxState' }
 * )
 *
 * // In parent component (Combobox.vue)
 * const state = useProvideComboboxState({
 *   items: ['Apple', 'Banana', 'Cherry'],
 *   selected: ref(null)
 * })
 *
 * // In child component (ComboboxOption.vue)
 * const { select, selected } = useComboboxState() // ✅ Works inside Combobox
 * // ❌ Throws "[useComboboxState] Missing provider. Make sure to call `useProvideComboboxState` in a parent component."
 * //    if used outside Combobox context
 * ```
 *
 * @see {@link https://vueuse.org/shared/createInjectionState/ VueUse createInjectionState}
 */
export function createStrictInjection<Arguments extends Array<any>, Return>(
	composable: (...args: Arguments) => Return,
	options: StrictInjectionOptions<Return>,
): StrictInjectionReturn<Arguments, Return> {
	const [useProvide, useInject] = createInjectionState(composable, options)

	const useStrictInject = () => {
		const ctx = useInject()
		if (ctx == null)
			throw new Error(`[use${options.name}] Missing provider. Make sure to call \`useProvide${options.name}\` in a parent component.`)
		return ctx
	}

	return [useProvide, useStrictInject]
}
