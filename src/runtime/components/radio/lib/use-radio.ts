import type { Ref } from 'vue'

import { computed } from 'vue'

import type { NuanceSize } from '../../../types'

import { useRadioGroupState } from './context'


export interface RadioControlProps {
	/** Value selected by this radio. @default 'on' */
	value?: string
	/** Native form control name; inherited from RadioGroup. */
	name?: string
	/** Disables the control. */
	disabled?: boolean
	/** Prevents user changes while keeping the control focusable. */
	readOnly?: boolean
	/** Requires a selection before submitting the form. */
	required?: boolean
	/** Control size; inherited from RadioGroup. @default 'sm' */
	size?: NuanceSize
}

/** Shares native control bindings between radios and radio cards. */
export function useRadio(props: RadioControlProps, model: Ref<string | null | undefined>) {
	const group = useRadioGroupState()
	const selection = group?.value ?? model
	const value = computed(() => props.value ?? 'on')
	const checked = computed(() => selection.value === value.value)
	const disabled = computed(() => !!(props.disabled || group?.disabled.value))
	const readOnly = computed(() => !!(props.readOnly || group?.readOnly.value))
	const size = computed(() => props.size ?? group?.size.value ?? 'sm')
	const name = computed(() => group?.name.value ?? props.name)
	const required = computed(() => !!(props.required || group?.required.value))

	function onChange(event: Event) {
		const input = event.target as HTMLInputElement
		if (disabled.value || readOnly.value) {
			input.checked = checked.value
			return
		}
		if (input.checked)
			selection.value = value.value
	}

	function onClick(event: MouseEvent) {
		if (readOnly.value)
			event.preventDefault()
	}

	function onKeydown(event: KeyboardEvent) {
		// Radio inputs do not support the native readonly attribute.
		if (readOnly.value && [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key))
			event.preventDefault()
	}

	return { group, value, checked, disabled, readOnly, size, name, required, onChange, onClick, onKeydown }
}
