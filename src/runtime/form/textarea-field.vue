<script setup lang='ts'>
import type { RuleExpression } from 'vee-validate'

import { useField } from 'vee-validate'

import type { TextareaProps } from '../components/textarea.vue'

import Textarea from '../components/textarea.vue'


export interface TextareaFieldProps extends Omit<TextareaProps, 'error'> {
	/** Field name used by vee-validate */
	name: string

	/** Validation rules, applied when `controlled: false` or as field-level override */
	rules?: RuleExpression<string>

	/** When to trigger validation @default `'blur'` */
	validateOn?: 'blur' | 'submit' | 'change'

	/** Pre-fills the field value */
	initialValue?: string

	/** If `false`, disconnects the field from the parent form context @default `true` */
	controlled?: boolean
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
} = useField<string>(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<Textarea
		v-bind='props'
		:model-value='value'
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
	</Textarea>
</template>
