import type { NuanceSize } from '@nui/types'
import type { ModelRef } from 'vue'

import { useSelectableGroup } from '@nui/composables'
import { createInjectionState } from '@vueuse/core'


export interface CheckboxGroupState {
	/** Selected values */
	value: ModelRef<string[]>

	/** Component size */
	size?: NuanceSize

	/** Disables the component */
	disabled?: boolean

	/** Prevents value changes */
	readOnly?: boolean

	/** Maximum number of switches that can be selected */
	maxSelectedValues?: number
}

const injectionKey = Symbol('CheckboxGroup')
const [useProvide, useState] = createInjectionState((state: CheckboxGroupState) => {
	const { value, size, disabled, readOnly, maxSelectedValues } = state
	const { update, isSelected, isDisabled } = useSelectableGroup(value, {
		disabled,
		readOnly,
		maxSelectedValues,
	})
	return { value, size, update, isDisabled, isSelected }
}, {
	injectionKey,
})

export const useProvideCheckboxGroup = useProvide
export const useCheckboxGroupState = useState
