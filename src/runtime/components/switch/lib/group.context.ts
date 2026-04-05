import type { NuanceSize } from '@nui/types'
import type { ModelRef } from 'vue'

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

	const onUpdate = (newValue: string) => {
		if (readOnly)
			return

		const isSelected = value.value.includes(newValue)

		if (!isSelected && maxSelectedValues !== undefined && value.value.length >= maxSelectedValues) {
			return
		}
		if (isSelected)
			return value.value = value.value.filter(i => i !== newValue)

		value.value = [...value.value, newValue]
	}

	const isDisabled = (switchValue: string) => {
		if (disabled)
			return true

		if (maxSelectedValues === undefined)
			return false

		const isSelected = value.value.includes(switchValue)
		const hasReachedLimit = value.value.length >= maxSelectedValues

		return !isSelected && hasReachedLimit
	}

	return {
		value,
		size,
		disabled,
		readOnly,
		maxSelectedValues,
		onUpdate,
		isDisabled,
	}
}, {
	injectionKey,
})

export const useProvideSwitchGroup = useProvide
export const useSwitchGroupState = useState
