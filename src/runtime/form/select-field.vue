<script setup lang='ts' generic='Value extends string = string, Ext extends ComboboxItemExt = object'>
import type { RuleExpression } from 'vee-validate'

import { useField } from 'vee-validate'

import type { ComboboxItemExt } from '../components/combobox'
import type { SelectProps } from '../components/select.vue'

import Select from '../components/select.vue'


export interface SelectFieldProps<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> extends Omit<SelectProps<Value, Ext>, 'error'> {
	/** Field name used by vee-validate */
	name: string

	/** Validation rules, applied when `controlled: false` or as field-level override */
	rules?: RuleExpression<string | string[] | null>

	/** When to trigger validation @default `'blur'` */
	validateOn?: 'blur' | 'submit' | 'change'

	/** Pre-fills the field value */
	initialValue?: string | string[] | null

	/** If `false`, disconnects the field from the parent form context @default `true` */
	controlled?: boolean
}

const {
	name,
	rules,
	validateOn = 'blur',
	initialValue = null,
	controlled = true,
	...props
} = defineProps<SelectFieldProps<Value, Ext>>()

const {
	value,
	errorMessage,
	handleBlur,
	handleChange,
} = useField<string | string[] | null>(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<Select
		v-bind='props'
		:model-value='value'
		:error='errorMessage'
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

		<template v-if='$slots.selection' #selection='slotProps'>
			<slot name='selection' v-bind='slotProps' />
		</template>
	</Select>
</template>
