import type { UiKitSize } from '@types'
import type { CSSProperties } from 'vue'

import { createStrictInjection } from '@helpers'
import { shallowRef } from 'vue'

import type { InputVariant } from '../model'


export interface WrapperContext {
	id?: string | null
	required?: boolean
	radius?: UiKitSize | string
	size?: UiKitSize | string
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
