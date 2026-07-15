<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { SwitchProps } from '../components/switch/switch.vue'
import type { FieldBaseProps } from './types'

import Switch from '../components/switch/switch.vue'


export interface SwitchFieldProps
	extends Omit<SwitchProps, 'error' | 'name'>, Omit<FieldBaseProps<boolean>, 'initialValue'> {
	checked?: true
}

const {
	name,
	rules,
	validateOn = 'change',
	controlled = true,
	checked: initialValue,
	...props
} = defineProps<SwitchFieldProps>()

const {
	checked,
	errorMessage,
	handleChange,
	meta
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
	<Switch
		v-bind='props'
		v-model='checked'
		:error='meta.touched ? errorMessage : undefined'
		@update:model-value='handleChange($event, validateOn === "change" || !!errorMessage)'
	>
		<template v-if='$slots.label' #label>
			<slot name='label' />
		</template>

		<template v-if='$slots.description' #description>
			<slot name='description' />
		</template>

		<template v-if='$slots.error' #error>
			<slot name='error' :error='errorMessage' />
		</template>
	</Switch>
</template>
