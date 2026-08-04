import type { AnyString, NuanceRadius, NuanceSize } from '@nui/types'
import type { CSSProperties } from 'vue'

export type InputVariant = 'default' | 'filled' | 'soft' | 'ghost' | 'unstyled'

/** Visual presentation shared by the wrapper and the input control */
export interface InputPresentationProps {
	/** Border radius */
	radius?: NuanceRadius | AnyString

	/** Component size */
	size?: NuanceSize | AnyString

	/** Visual variant */
	variant?: InputVariant
}

/** Interaction state of the input control */
export interface InputStateProps {
	/** If set, the value cannot be updated */
	readonly?: boolean

	/** If set, the component becomes disabled */
	disabled?: boolean
}

/** Content rendered in the input's left and right sections */
export interface InputSectionProps {
	/** Icon displayed in the left section */
	icon?: string

	/** Text displayed in the left section */
	prefix?: string

	/** Icon displayed in the right section */
	trailingIcon?: string

	/** Text displayed in the right section */
	postfix?: string
}

/** Multiline (textarea) behavior */
export interface InputMultilineProps {
	/** Enables multiline (textarea) mode */
	multiline?: boolean

	/** CSS resize behavior for multiline inputs */
	resize?: CSSProperties['resize']
}
