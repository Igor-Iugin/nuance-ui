<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { CheckboxGroupProps } from '../components/checkbox/checkbox-group.vue'
import type { FieldBaseProps } from './types'

import CheckboxGroup from '../components/checkbox/checkbox-group.vue'


export interface CheckboxGroupFieldProps
	extends Omit<CheckboxGroupProps, 'error' | 'name'>, FieldBaseProps<string[]> {
}

const {
	name,
	rules,
	validateOn = 'change',
	initialValue,
	controlled = true,
	...props
} = defineProps<CheckboxGroupFieldProps>()

const {
	value,
	errorMessage,
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
	<CheckboxGroup
		v-bind='props'
		v-model='value'
		:error='meta.touched ? errorMessage : undefined'
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
	</CheckboxGroup>
</template>
