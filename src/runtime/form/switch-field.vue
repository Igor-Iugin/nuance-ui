<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { SwitchProps } from '../components/switch/switch.vue'
import type { FieldBaseProps } from './types'

import Switch from '../components/switch/switch.vue'


export interface SwitchFieldProps
	extends Omit<SwitchProps, 'error' | 'name'>, FieldBaseProps<boolean> {
}

const {
	name,
	rules,
	validateOn = 'change',
	initialValue,
	controlled = true,
	...props
} = defineProps<SwitchFieldProps>()

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
	<Switch
		v-bind='props'
		:model-value='value'
		:error='errorMessage'
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
