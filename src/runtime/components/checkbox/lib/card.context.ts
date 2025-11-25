import type { ComputedRef } from 'vue'

import { createStrictInjection } from '@helpers'


export interface CheckboxCardState {
	value: ComputedRef<boolean>
	onUpdate: () => void
}

const injectionKey = Symbol('CheckboxCard')
const [useProvide, useState] = createStrictInjection((props: CheckboxCardState) => props, {
	injectionKey,
	name: 'CheckboxCard',
})

export const useProvideCheckboxCard = useProvide
export const useCheckboxCardState = useState
