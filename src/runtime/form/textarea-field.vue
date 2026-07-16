<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { TextareaProps } from '../components/textarea.vue'
import type { FieldBaseProps } from './types'

import Textarea from '../components/textarea.vue'


export interface TextareaFieldProps extends Omit<TextareaProps, 'error'>, Omit<FieldBaseProps<string>, 'validateOn'> {
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
} = defineProps<TextareaFieldProps>()

const {
	value,
	errorMessage,
	handleBlur,
	handleChange,
	meta,
} = useField(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<Textarea
		v-bind='props'
		v-model='value'
		:name
		:error='meta.touched ? errorMessage : undefined'
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
	</Textarea>
</template>
