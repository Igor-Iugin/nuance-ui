import type { NuanceSize } from '@nui/types'
import type { ModelRef } from 'vue'

import { useSelectableGroup } from '@nui/composables'
import { createInjectionState } from '@vueuse/core'


export interface SwitchGroupState {
	value: ModelRef<string[]>
	size?: NuanceSize
	disabled?: boolean
	readOnly?: boolean
	maxSelectedValues?: number
}

const injectionKey = Symbol('SwitchGroup')
const [useProvide, useState] = createInjectionState((state: SwitchGroupState) => {
	const { value, size, disabled, readOnly, maxSelectedValues } = state
	const { update, isSelected, isDisabled } = useSelectableGroup(value, {
		disabled,
		readOnly,
		maxSelectedValues,
	})

	return {
		value,
		size,
		disabled,
		readOnly,
		maxSelectedValues,
		update,
		isSelected,
		isDisabled,
	}
}, {
	injectionKey,
})

export const useProvideSwitchGroup = useProvide
export const useSwitchGroupState = useState
