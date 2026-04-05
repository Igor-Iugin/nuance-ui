<script setup lang='ts'>
import type { NuanceSize } from '@nui/types'

import { useId } from 'vue'

import type { InputWrapperProps } from '../input'

import InputWrapper from '../input/ui/input-wrapper.vue'
import VisuallyHiddenInput from '../visually-hidden/visually-hidden-input.vue'
import { useProvideCheckboxGroup } from './lib/group.context'


export interface CheckboxGroupProps extends Omit<InputWrapperProps, 'resize' | 'multiline' | 'id' | 'size'> {
	/** Input name */
	name?: string

	/** Component size */
	size?: NuanceSize

	/** Prevents value changes */
	readOnly?: boolean

	/** Disables the component */
	disabled?: boolean

	/**
	 * Maximum number of checkboxes that can be selected.
	 * Unselected switches are disabled once the limit is reached
	 */
	maxSelectedValues?: number
}

const {
	size,
	name,
	maxSelectedValues,
	disabled,
	readOnly,
	...rest
} = defineProps<CheckboxGroupProps>()
const value = defineModel<string[]>({ default: [] })

const id = useId()

useProvideCheckboxGroup({ value, size, maxSelectedValues, disabled,	readOnly })
</script>

<template>
	<InputWrapper :id v-bind='rest'>
		<template v-if='!!$slots.label' #label>
			<slot name='label' />
		</template>

		<slot />

		<template v-if='!!$slots.description' #description>
			<slot name='description' />
		</template>
		<template v-if='!!$slots.error' #error>
			<slot name='error' />
		</template>

		<VisuallyHiddenInput :id v-model='value' :name />
	</InputWrapper>
</template>

