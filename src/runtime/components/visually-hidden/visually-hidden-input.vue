<script setup lang='ts' generic='T'>
import type { VisuallyHiddenProps } from './visually-hidden.vue'

import VisuallyHidden from './visually-hidden.vue'


export interface VisuallyHiddenInputProps extends VisuallyHiddenProps {
	/** Input name */
	name?: string

	/** Marks the input as required */
	required?: boolean

	/** Disables the input */
	disabled?: boolean
}

const props = defineProps<VisuallyHiddenInputProps>()
const value = defineModel<T>()
</script>

<template>
	<VisuallyHidden v-bind='{ ...props, ...$attrs }' is='input' v-model='value' />
</template>
