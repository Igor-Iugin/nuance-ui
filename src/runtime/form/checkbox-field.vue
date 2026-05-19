<script setup lang='ts'>
import type { RuleExpression } from 'vee-validate'

import { useField } from 'vee-validate'

import type { CheckboxProps } from '../components/checkbox/checkbox.vue'

import Checkbox from '../components/checkbox/checkbox.vue'


export interface CheckboxFieldProps extends Omit<CheckboxProps, 'error'> {
	/** Field name used by vee-validate */
	name: string

	/** Validation rules, applied when `controlled: false` or as field-level override */
	rules?: RuleExpression<boolean>

	/** When to trigger validation @default `'change'` */
	validateOn?: 'change' | 'submit'

	/** Pre-fills the field value @default `false` */
	initialValue?: boolean

	/** If `false`, disconnects the field from the parent form context @default `true` */
	controlled?: boolean
}

const {
	name,
	rules,
	validateOn = 'change',
	initialValue = false,
	controlled = true,
	...props
} = defineProps<CheckboxFieldProps>()

const {
	value,
	errorMessage,
	handleChange,
} = useField<boolean>(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<Checkbox
		v-bind='props'
		:model-value='value'
		:error='errorMessage'
		@update:model-value='handleChange($event, validateOn === "change" || !!errorMessage)'
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

		<template v-if='$slots.error' #error>
			<slot name='error' :error='errorMessage' />
		</template>
	</Checkbox>
</template>
