<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { CheckboxProps } from '../components/checkbox/checkbox.vue'
import type { FieldBaseProps } from './types'

import Checkbox from '../components/checkbox/checkbox.vue'


export interface CheckboxFieldProps
	extends Omit<CheckboxProps, 'error'>, Omit<FieldBaseProps<boolean>, 'initialValue'> {
	checked?: true
}

const {
	name,
	rules,
	validateOn = 'change',
	checked: initialValue,
	controlled = true,
	...props
} = defineProps<CheckboxFieldProps>()

const {
	checked,
	errorMessage,
	handleChange,
} = useField(() => name, rules, {
	type: 'checkbox',
	validateOnValueUpdate: false,
	validateOnMount: false,
	checkedValue: true,
	initialValue: initialValue || undefined,
	controlled,
})
</script>

<template>
	<Checkbox
		v-bind='props'
		v-model='checked'
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
