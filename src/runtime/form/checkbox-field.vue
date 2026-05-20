<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { CheckboxProps } from '../components/checkbox/checkbox.vue'
import type { FieldBaseProps } from './types'

import Checkbox from '../components/checkbox/checkbox.vue'


export interface CheckboxFieldProps
	extends Omit<CheckboxProps, 'error'>, FieldBaseProps<boolean> {
}

const {
	name,
	rules,
	validateOn = 'change',
	initialValue,
	controlled = true,
	...props
} = defineProps<CheckboxFieldProps>()

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
