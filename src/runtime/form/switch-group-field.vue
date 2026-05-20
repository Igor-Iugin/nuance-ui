<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { SwitchGroupProps } from '../components/switch/switch-group.vue'
import type { FieldBaseProps } from './types'

import SwitchGroup from '../components/switch/switch-group.vue'


export interface SwitchGroupFieldProps
	extends Omit<SwitchGroupProps, 'error' | 'name'>, FieldBaseProps<string[]> {
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
} = useField(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	initialValue,
	controlled,
})
</script>

<template>
	<SwitchGroup
		v-bind='props'
		v-model='value'
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
