<script setup lang='ts'>
import type { UiKitSize } from '@types'

import { useId } from 'vue'

import type { InputWrapperProps } from '../input'

import InputWrapper from '../input/ui/input-wrapper.vue'
import VisuallyHiddenInput from '../visually-hidden/visually-hidden-input.vue'
import { useProvideCheckboxGroup } from './lib/group.context'


export interface CheckboxGroupProps extends Omit<InputWrapperProps, 'resize' | 'multiline' | 'id'> {
	name: string
	size?: UiKitSize
}

const { size, name, ...rest } = defineProps<CheckboxGroupProps>()
const value = defineModel<string[]>({ default: [] as string[] })

const id = useId()

useProvideCheckboxGroup({ value, size })
</script>

<template>
	<InputWrapper :id v-bind='rest'>
		<template #label>
			<slot name='label' />
		</template>

		<slot />

		<template #description>
			<slot name='description' />
		</template>
		<template #error>
			<slot name='error' />
		</template>

		<VisuallyHiddenInput :id v-model='value' :name />
	</InputWrapper>
</template>

