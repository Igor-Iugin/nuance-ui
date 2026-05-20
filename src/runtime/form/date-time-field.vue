<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { DatePickerProps } from '../components/date-time-picker.vue'
import type { FieldBaseProps } from './types'

import DateTimePicker from '../components/date-time-picker.vue'


export interface DateTimeFieldProps
	extends Omit<DatePickerProps, 'error' | 'name'>, FieldBaseProps<string | Date | null> {
}

const {
	name,
	rules,
	validateOn = 'change',
	initialValue,
	controlled = true,
	...props
} = defineProps<DateTimeFieldProps>()

const {
	value,
	errorMessage,
	handleChange,
} = useField(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<DateTimePicker
		v-bind='props'
		v-model='value'
		:error='errorMessage'
		@update:model-value='handleChange($event, validateOn === "change" || !!errorMessage)'
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
	</DateTimePicker>
</template>
