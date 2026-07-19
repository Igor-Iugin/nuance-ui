import { createInjectionState } from '@vueuse/core'


export interface MenuRadioGroupState {
	/** Currently selected value */
	value: string | undefined
	/** Selects the given value */
	onChange: (value: string) => void
}

export interface MenuCheckboxGroupState {
	/** Currently selected values */
	value: string[]
	/** Adds or removes the value from the selection */
	onChange: (value: string, checked: boolean) => void
}

const [provideRadioGroup, useRadioGroup] = createInjectionState(
	(state: MenuRadioGroupState) => state,
	{ injectionKey: Symbol('nuance-menu-radio-group') },
)

const [provideCheckboxGroup, useCheckboxGroup] = createInjectionState(
	(state: MenuCheckboxGroupState) => state,
	{ injectionKey: Symbol('nuance-menu-checkbox-group') },
)

export { provideCheckboxGroup, provideRadioGroup }

export const useMenuRadioGroupState = useRadioGroup
export const useMenuCheckboxGroupState = useCheckboxGroup
