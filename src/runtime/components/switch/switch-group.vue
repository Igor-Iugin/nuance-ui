<script setup lang='ts'>
import type { NuanceSize } from '@nui/types'

import { useId } from 'vue'

import type { InputWrapperProps } from '../input'

import InputWrapper from '../input/ui/input-wrapper.vue'
import VisuallyHiddenInput from '../visually-hidden/visually-hidden-input.vue'
import { useProvideSwitchGroup } from './lib/group.context'


export interface SwitchGroupProps extends Omit<InputWrapperProps, 'resize' | 'multiline' | 'id' | 'size'> {
	name?: string
	size?: NuanceSize
	/** If set, value cannot be changed */
	readOnly?: boolean
	/** Sets `disabled` attribute, prevents interactions */
	disabled?: boolean
	/** Maximum number of switches that can be selected. When the limit is reached, unselected switches will be disabled */
	maxSelectedValues?: number
}

const {
	size,
	name,
	disabled,
	readOnly,
	maxSelectedValues,
	...rest
} = defineProps<SwitchGroupProps>()

const value = defineModel<string[]>({ default: [] })

const id = useId()

useProvideSwitchGroup({ value, size, disabled, readOnly, maxSelectedValues })
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
