import type { InjectionKey } from '@vue/runtime-core'
import type { CreateInjectionStateOptions } from '@vueuse/core'

import { createInjectionState } from '@vueuse/core'


interface StrictInjectionOptions<Return> extends Omit<CreateInjectionStateOptions<Return>, 'injectionKey'> {
	/** Human-readable context name embedded into the missing-provider error message. */
	name: string
	/** Vue injection key used to store and read the provided state. */
	injectionKey: InjectionKey<Return>
}

type StrictInjectionReturn<Arguments extends Array<any>, Return> = Readonly<[
	/**
	 * Provider function to be called in a parent component.
	 * Creates and provides the state to all descendant components.
	 */
	useProvidingState: (...args: Arguments) => Return,

	/**
	 * Consumer function to be called in a child component.
	 * Injects the state provided by the nearest parent provider.
	 *
	 * @throws {Error} When called outside of a provider context
	 */
	useInjectedState: () => Return,
]>

/**
 * Creates a strict provide/inject.
 *
 * Unlike Vue's standard `inject`, the returned consumer hook throws a
 * descriptive error when called outside of a provider, so misuse surfaces
 * immediately instead of producing silent `undefined` values downstream.
 *
 * @example
 * ```ts
 * const [useProvideComboboxState, useComboboxState] = createStrictInjection(
 *   (state: ComboboxState) => ({
 *     ...state,
 *     select: (item: string) => { state.selected.value = item },
 *   }),
 *   { name: 'ComboboxState', injectionKey: Symbol('combobox-state') },
 * )
 * ```
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
