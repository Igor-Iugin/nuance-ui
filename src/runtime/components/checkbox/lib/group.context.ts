import type { NuanceSize } from '@nui/types'
import type { ModelRef } from 'vue'

import { createInjectionState } from '@vueuse/core'


export interface CheckboxGroupState {
	value: ModelRef<string[]>
	size?: NuanceSize
}

const injectionKey = Symbol('CheckboxGroup')
const [useProvide, useState] = createInjectionState(({ value, size }: CheckboxGroupState) => {
	const onUpdate = (newValue: string) => {
		if (value.value.includes(newValue))
			return value.value = value.value.filter(i => i !== newValue)

		return value.value.push(newValue)
	}

	return { value, size, onUpdate }
}, {
	injectionKey,
})

export const useProvideCheckboxGroup = useProvide
export const useCheckboxGroupState = useState
