<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { NumberInputProps } from '../components/input/number-input.vue'
import type { FieldBaseProps } from './types'

import NumberInput from '../components/input/number-input.vue'


export interface NumberFieldProps
	extends Omit<NumberInputProps, 'error'>, Omit<FieldBaseProps<number>, 'validateOn'> {
	/** When to trigger validation @default `'blur'` */
	validateOn?: 'blur' | 'submit' | 'change'
}

const {
	name,
	rules,
	validateOn = 'blur',
	initialValue,
	controlled = true,
	min = Number.MIN_SAFE_INTEGER,
	max = Number.MAX_SAFE_INTEGER,
	...props
} = defineProps<NumberFieldProps>()

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
	<NumberInput
		v-bind='props'
		v-model='value'
		:name
		:min
		:max
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
	</NumberInput>
</template>
