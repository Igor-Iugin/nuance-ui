import type { ComputedRef, InjectionKey, Ref } from 'vue'

import { inject } from 'vue'

import type { NuanceSize } from '../../../types'


export interface RadioGroupState {
	value: Ref<string | null | undefined>
	name: ComputedRef<string>
	size: ComputedRef<NuanceSize | undefined>
	disabled: ComputedRef<boolean>
	readOnly: ComputedRef<boolean>
	required: ComputedRef<boolean>
	error: ComputedRef<boolean>
	describedBy: ComputedRef<string | undefined>
}

export interface RadioCardState {
	checked: ComputedRef<boolean>
	disabled: ComputedRef<boolean>
	size: ComputedRef<NuanceSize>
}

export const radioGroupKey: InjectionKey<RadioGroupState> = Symbol('RadioGroup')
export const radioCardKey: InjectionKey<RadioCardState> = Symbol('RadioCard')

export const useRadioGroupState = () => inject(radioGroupKey, undefined)
export const useRadioCardState = () => inject(radioCardKey, undefined)
