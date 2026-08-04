import type { CSSProperties } from 'vue'

import { createInjectionState } from '@vueuse/core'

import type { InputMultilineProps, InputPresentationProps } from '../types'


export interface WrapperContext extends InputPresentationProps, InputMultilineProps {
	/** Id used to bind input and label, auto-generated if not provided */
	id?: string | null

	/** Marks the field as required */
	required?: boolean

	/** `pointer-events` value for the left section */
	leftSectionPE?: CSSProperties['pointerEvents']

	/** `pointer-events` value for the right section */
	rightSectionPE?: CSSProperties['pointerEvents']
}

const injectionKey = Symbol('InputWrapper')
const [useProvide, useState] = createInjectionState(init => init, {
	injectionKey,
})

export const useProvideInputWrapper = useProvide
export const useInputWrapperState = useState
