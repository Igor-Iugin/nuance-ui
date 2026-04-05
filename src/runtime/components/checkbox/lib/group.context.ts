import type { NuanceSize } from '@nui/types'
import type { ModelRef } from 'vue'

import { useSelectableGroup } from '@nui/composables'
import { createInjectionState } from '@vueuse/core'


export interface CheckboxGroupState {
	value: ModelRef<string[]>
	size?: NuanceSize
}

const injectionKey = Symbol('CheckboxGroup')
const [useProvide, useState] = createInjectionState(({ value, size }: CheckboxGroupState) => {
	const { update } = useSelectableGroup(value)

	return { value, size, update }
}, {
	injectionKey,
})

export const useProvideCheckboxGroup = useProvide
export const useCheckboxGroupState = useState
