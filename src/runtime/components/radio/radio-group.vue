<script setup lang='ts'>
import type { Classes, NuanceSize } from '@nui/types'

import { getFontSize } from '@nui/utils'
import { computed, provide, useId, useSlots } from 'vue'

import Box from '../box/box.vue'
import { radioGroupKey } from './lib/context'


export interface RadioGroupProps {
	id?: string
	name?: string
	label?: string
	description?: string
	error?: string
	size?: NuanceSize
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	classes?: Classes<'root' | 'label' | 'description' | 'error'>
}

const props = defineProps<RadioGroupProps>()
/** Selected radio value. */
const model = defineModel<string | null>()
const slots = useSlots()
const id = computed(() => props.id ?? useId())
const describedBy = computed(() => props.error || slots.error
	? `${id.value}-error`
	: props.description || slots.description ? `${id.value}-description` : undefined)

provide(radioGroupKey, {
	value: model,
	name: computed(() => props.name ?? id.value),
	size: computed(() => props.size),
	disabled: computed(() => !!props.disabled),
	readOnly: computed(() => !!props.readOnly),
	required: computed(() => !!props.required),
	error: computed(() => !!(props.error || slots.error)),
	describedBy,
})
</script>

<template>
	<Box
		is='fieldset'
		:id
		:disabled='props.disabled'
		:aria-describedby='describedBy'
		:class='[$style.root, props.classes?.root]'
		:style='{ "--radio-label-size": getFontSize(props.size ?? "sm") }'
	>
		<legend
			v-if='props.label || $slots.label'
			:class='[$style.label, props.classes?.label]'
		>
			<slot name='label'>
				{{ props.label }}
			</slot>

			<span
				v-if='props.required'
				aria-hidden='true'
				:class='$style.required'
			> *</span>
		</legend>

		<slot />

		<p
			v-if='props.error || $slots.error'
			:id='`${id}-error`'
			:class='[$style.error, props.classes?.error]'
			aria-live='polite'
		>
			<slot name='error'>
				{{ props.error }}
			</slot>
		</p>

		<p
			v-else-if='props.description || $slots.description'
			:id='`${id}-description`'
			:class='[$style.description, props.classes?.description]'
		>
			<slot name='description'>
				{{ props.description }}
			</slot>
		</p>
	</Box>
</template>

<style module>
.root {
	min-inline-size: 0;
	margin: 0;
	padding: 0;
	border: 0;
}

.label {
	margin-block-end: .25rem;
	padding: 0;

	font-size: var(--radio-label-size);
	font-weight: 500;
}

.description,
.error {
	margin: .25rem 0 0;

	font-size: calc(var(--radio-label-size) - .125rem);
	color: var(--color-dimmed);
}

.error,
.required {
	color: var(--color-error);
}
</style>
