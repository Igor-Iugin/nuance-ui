<script setup lang='ts' generic='T extends boolean = false'>
import type { ChipGroupValue } from './lib'
import { useProvideChipGroupState } from './lib'

import VisuallyHiddenInput from '../visually-hidden/visually-hidden-input.vue'


export interface ChipGroupProps<T extends boolean = false> {
	name: string
	multiple?: T
	disabled?: boolean
}

const {
	multiple = false,
	disabled,
	name,
} = defineProps<ChipGroupProps<T>>()
const value = defineModel<ChipGroupValue<T>>({ default: null })

useProvideChipGroupState({ multiple, value, disabled })
</script>

<template>
	<slot/>
	<VisuallyHiddenInput v-model='value' :name/>
</template>
