<script setup lang='ts' generic='Mode extends SelectionMode = "single"'>
import type { RuleExpression } from 'vee-validate'

import { useField } from 'vee-validate'

import type { DateSelection, SelectionMode } from '../components/calendar'
import type { DatePickerProps } from '../components/input/date-picker.vue'

import DatePicker from '../components/input/date-picker.vue'


export interface DateFieldProps<Mode extends SelectionMode = 'single'>
	extends Omit<DatePickerProps<Mode>, 'error'> {
	/** Field name used by vee-validate */
	name: string

	/** Validation rules, applied when `controlled: false` or as field-level override */
	rules?: RuleExpression<DateSelection<Mode>>

	/** When to trigger validation @default `'change'` */
	validateOn?: 'change' | 'submit'

	/** Pre-fills the field value */
	initialValue?: DateSelection<Mode>

	/** If `false`, disconnects the field from the parent form context @default `true` */
	controlled?: boolean
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
} = useField<DateSelection<Mode>>(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<DatePicker
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
	</DatePicker>
</template>
