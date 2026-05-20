<script setup lang='ts' generic='Mode extends SelectionMode = "single"'>
import { useField } from 'vee-validate'

import type { DateSelection, SelectionMode } from '../components/calendar'
import type { DatePickerProps } from '../components/input/date-picker.vue'
import type { FieldBaseProps } from './types'

import DatePicker from '../components/input/date-picker.vue'


export interface DateFieldProps<Mode extends SelectionMode = 'single'>
	extends Omit<DatePickerProps<Mode>, 'error' | 'name'>, FieldBaseProps<DateSelection<Mode>> {
}

const {
	name,
	rules,
	validateOn = 'change',
	initialValue,
	controlled = true,
	...props
} = defineProps<DateFieldProps<Mode>>()

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
	<DatePicker
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
	</DatePicker>
</template>
