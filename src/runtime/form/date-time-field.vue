<script setup lang='ts'>
import type { RuleExpression } from 'vee-validate'

import { useField } from 'vee-validate'

import type { DatePickerProps } from '../components/date-time-picker.vue'

import DateTimePicker from '../components/date-time-picker.vue'


export interface DateTimeFieldProps extends Omit<DatePickerProps, 'error'> {
	/** Field name used by vee-validate */
	name: string

	/** Validation rules, applied when `controlled: false` or as field-level override */
	rules?: RuleExpression<string | Date | null>

	/** When to trigger validation @default `'change'` */
	validateOn?: 'change' | 'submit'

	/** Pre-fills the field value */
	initialValue?: string | Date | null

	/** If `false`, disconnects the field from the parent form context @default `true` */
	controlled?: boolean
}

const {
	name,
	rules,
	validateOn = 'change',
	initialValue = null,
	controlled = true,
	...props
} = defineProps<DateTimeFieldProps>()

const {
	value,
	errorMessage,
	handleChange,
} = useField<string | Date | null>(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<DateTimePicker
		v-bind='props'
		:model-value='value'
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
