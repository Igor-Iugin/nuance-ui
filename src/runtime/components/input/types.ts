export type InputVariant = 'default' | 'filled' | 'unstyled'

export interface InputBaseProps {
	/** If set, the value cannot be updated */
	readonly?: boolean
	/** If set, the component becomes disabled */
	disabled?: boolean
}
