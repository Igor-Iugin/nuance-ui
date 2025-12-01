import type { ComputedRef } from 'vue'

import { createInjectionState } from '@vueuse/core'


export interface CheckboxCardState {
	value: ComputedRef<boolean>
	onUpdate: () => void
}

const injectionKey = Symbol('CheckboxCard')
const [useProvide, useState] = createInjectionState((props: CheckboxCardState) => props, {
	injectionKey,
})

export const useProvideCheckboxCard = useProvide
export const useCheckboxCardState = useState
