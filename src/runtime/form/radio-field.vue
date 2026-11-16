<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { RadioProps } from '../components/radio/radio.vue'
import type { FieldBaseProps } from './types'

import Radio from '../components/radio/radio.vue'


export interface RadioFieldProps
	extends Omit<RadioProps, 'error' | 'name'>, FieldBaseProps<string | null> {
}

const {
	name,
	rules,
	validateOn = 'change',
	initialValue,
	controlled = true,
	value: radioValue = 'on',
	...props
} = defineProps<RadioFieldProps>()

const {
	value,
	errorMessage,
	handleBlur,
	handleChange,
	setTouched,
	meta,
} = useField<string | null>(() => name, rules, {
	type: 'radio',
	checkedValue: () => radioValue,
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
	<Radio
		v-bind='props'
		:name
		:value='radioValue'
		:model-value='value'
		:error='meta.touched ? errorMessage : undefined'
		@update:model-value='onChange'
		@blur='handleBlur($event, false)'
	>
		<template v-if='$slots.icon' #icon='slotProps'>
			<slot name='icon' v-bind='slotProps' />
		</template>

		<template v-if='$slots.label' #label>
			<slot name='label' />
		</template>

		<template v-if='$slots.description' #description>
			<slot name='description' />
		</template>

		<template v-if='$slots.error && meta.touched && errorMessage' #error>
			<slot name='error' :error='errorMessage' />
		</template>
	</Radio>
</template>
