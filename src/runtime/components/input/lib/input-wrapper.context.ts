import type { NuanceSize } from '@nui/types'
import type { CSSProperties } from 'vue'

import { createInjectionState } from '@vueuse/core'

import type { InputVariant } from '../types'


export interface WrapperContext {
	id?: string | null
	required?: boolean
	radius?: NuanceSize | string
	size?: NuanceSize | string
	variant?: InputVariant
	multiline?: boolean
	resize?: CSSProperties['resize']
	/** section pointer-events */
	leftSectionPE?: CSSStyleDeclaration['pointerEvents']
	/** section pointer-events */
	rightSectionPE?: CSSStyleDeclaration['pointerEvents']
}

const injectionKey = Symbol('InputWrapper')
const [useProvide, useState] = createInjectionState(init => init, {
	injectionKey,
})

export const useProvideInputWrapper = useProvide
export const useInputWrapperState = useState
