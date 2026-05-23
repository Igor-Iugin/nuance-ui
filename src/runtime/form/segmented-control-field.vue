<script setup lang='ts'>
import { useField } from 'vee-validate'

import type { SegmentedControlProps } from '../components/segmented-control.vue'
import type { FieldBaseProps } from './types'

import SegmentedControl from '../components/segmented-control.vue'


export interface SegmentedControlFieldProps
	extends SegmentedControlProps, Omit<FieldBaseProps<string>, 'initialValue'> {
}

const {
	name,
	rules,
	validateOn = 'change',
	controlled = true,
	...props
} = defineProps<SegmentedControlFieldProps>()

const {
	value,
	handleChange,
} = useField(() => name, rules, {
	validateOnValueUpdate: false,
	validateOnMount: false,
	controlled,
})
</script>

<template>
	<SegmentedControl
		v-bind='props'
		v-model='value'
		@update:model-value='handleChange($event, validateOn === "change")'
	/>
</template>
