<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { TextInputProps } from '../components/input/text-input.vue'
import type { FieldBaseProps } from './types'

import PasswordInput from '../components/input/password-input.vue'


export interface PasswordFieldProps
	extends Omit<TextInputProps, 'error'>, Omit<FieldBaseProps<string>, 'validateOn'> {
	/** When to trigger validation @default `'blur'` */
	validateOn?: 'blur' | 'submit' | 'change'
}

const {
	name,
	rules,
	validateOn = 'blur',
	initialValue,
	controlled = true,
	...props
} = defineProps<PasswordFieldProps>()

const {
	value,
	errorMessage,
	handleBlur,
	handleChange,
} = useField(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<PasswordInput
		v-bind='props'
		v-model='value'
		:error='errorMessage'
		:name
		@update:model-value='handleChange($event, !!errorMessage)'
		@blur='handleBlur($event, validateOn === "blur")'
	>
		<template v-if='$slots.leftSection' #leftSection>
			<slot name='leftSection' />
		</template>

		<template v-if='$slots.rightSection' #rightSection>
			<slot name='rightSection' />
		</template>

		<template v-if='$slots.label' #label>
			<slot name='label' />
		</template>

		<template v-if='$slots.description' #description>
			<slot name='description' />
		</template>

		<template v-if='$slots.error' #error>
			<slot name='error' :error='errorMessage' />
		</template>
	</PasswordInput>
</template>
