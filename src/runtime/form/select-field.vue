<script setup lang='ts' generic='Value extends string = string, Ext extends ComboboxItemExt = object'>
import { useField } from 'vee-validate'

import type { ComboboxItemExt } from '../components/combobox'
import type { SelectProps } from '../components/select.vue'
import type { FieldBaseProps } from './types'

import Select from '../components/select.vue'


export interface SelectFieldProps<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> extends Omit<SelectProps<Value, Ext>, 'error'>, Omit<FieldBaseProps<string | string[] | null>, 'validateOn'> {
	/** When to trigger validation @default `'blur'` */
	validateOn?: 'blur' | 'submit' | 'change'
}

const {
	name,
	rules,
	validateOn = 'blur',
	initialValue,
	controlled = true,
	...props
} = defineProps<SelectFieldProps<Value, Ext>>()

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
	<Select
		v-bind='props'
		v-model='value'
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

		<template v-if='$slots.selection' #selection='slotProps'>
			<slot name='selection' v-bind='slotProps' />
		</template>
	</Select>
</template>
