<script setup lang='ts'>
import type { RuleExpression } from 'vee-validate'

import { useField } from 'vee-validate'

import type { SwitchGroupProps } from '../components/switch/switch-group.vue'

import SwitchGroup from '../components/switch/switch-group.vue'


export interface SwitchGroupFieldProps extends Omit<SwitchGroupProps, 'error'> {
	/** Field name used by vee-validate */
	name: string

	/** Validation rules, applied when `controlled: false` or as field-level override */
	rules?: RuleExpression<string[]>

	/** When to trigger validation @default `'change'` */
	validateOn?: 'change' | 'submit'

	/** Pre-fills the field value */
	initialValue?: string[]

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
} = defineProps<SwitchGroupFieldProps>()

const {
	value,
	errorMessage,
	handleChange,
} = useField<string[]>(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<SwitchGroup
		v-bind='props'
		:model-value='value ?? []'
		:error='errorMessage'
		@update:model-value='handleChange($event, validateOn === "change" || !!errorMessage)'
	>
		<slot />

		<template v-if='$slots.label' #label>
			<slot name='label' />
		</template>

		<template v-if='$slots.description' #description>
			<slot name='description' />
		</template>

		<template v-if='$slots.error' #error>
			<slot name='error' :error='errorMessage' />
		</template>
	</SwitchGroup>
</template>
