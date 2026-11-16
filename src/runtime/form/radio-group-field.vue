<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { RadioGroupProps } from '../components/radio/radio-group.vue'
import type { FieldBaseProps } from './types'

import RadioGroup from '../components/radio/radio-group.vue'


export interface RadioGroupFieldProps
	extends Omit<RadioGroupProps, 'error' | 'name'>, FieldBaseProps<string | null> {
}

const {
	name,
	rules,
	validateOn = 'change',
	initialValue,
	controlled = true,
	...props
} = defineProps<RadioGroupFieldProps>()

const {
	value,
	errorMessage,
	handleBlur,
	handleChange,
	setTouched,
	meta,
} = useField<string | null>(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})

function onChange(value: string | null | undefined) {
	setTouched(true)
	handleChange(value, validateOn === 'change' || !!errorMessage.value)
}
</script>

<template>
	<RadioGroup
		v-bind='props'
		:name
		:model-value='value'
		:error='meta.touched ? errorMessage : undefined'
		@update:model-value='onChange'
		@focusout='handleBlur($event, false)'
	>
		<slot />

		<template v-if='$slots.label' #label>
			<slot name='label' />
		</template>

		<template v-if='$slots.description' #description>
			<slot name='description' />
		</template>

		<template v-if='$slots.error && meta.touched && errorMessage' #error>
			<slot name='error' :error='errorMessage' />
		</template>
	</RadioGroup>
</template>
