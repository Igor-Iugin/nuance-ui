import type { NuanceSize } from '@nui/types'
import type { CSSProperties } from 'vue'

import { createStrictInjection } from '@nui/helpers'
import { shallowRef } from 'vue'

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
const [useProvide, useState] = createStrictInjection((initial: WrapperContext) => shallowRef(initial), {
	injectionKey,
	name: 'InputWrapper',
})

export const useProvideInputWrapper = useProvide
export const useInputWrapperState = useState
