import type { AnyString, NuanceRadius, NuanceSize } from '@nui/types'
import type { CSSProperties } from 'vue'

import { createInjectionState } from '@vueuse/core'

import type { InputVariant } from '../types'


export interface WrapperContext {
	/** Id used to bind input and label, auto-generated if not provided */
	id?: string | null

	/** Marks the field as required */
	required?: boolean

	/** Border radius */
	radius?: NuanceRadius | AnyString

	/** Component size */
	size?: NuanceSize | AnyString

	/** Visual variant */
	variant?: InputVariant

	/** Enables multiline (textarea) mode */
	multiline?: boolean

	/** CSS resize behavior for multiline inputs */
	resize?: CSSProperties['resize']

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
