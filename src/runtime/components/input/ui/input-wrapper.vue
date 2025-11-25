<script lang='ts' setup>
import { getFontSize } from '@utils'
import { computed, useId } from 'vue'

import type { WrapperContext } from '../lib/input-wrapper.context'
import { useProvideInputWrapper } from '../lib/input-wrapper.context'
import type { InputLabelProps } from './input-label.vue'
import InputLabel from './input-label.vue'


export interface InputWrapperProps extends WrapperContext, InputLabelProps {
	error?: string
	description?: string
	label?: string
}

const {
	id: _id,
	error,
	description,
	label,
	required,
	variant = 'default',
	size = 'sm',
	radius = 'sm',
	...props
} = defineProps<InputWrapperProps>()

const id = _id ?? useId()

useProvideInputWrapper({
	id,
	variant,
	required,
	size,
	radius,
	...props,
})

const style = computed(() => ({
	'--input-error-size': `calc(${getFontSize(size)} - .125rem)`,
	'--input-description-size': `calc(${getFontSize(size)} - .125rem)`,
}))
</script>

<template>
	<div :style :class='$style.root'>
		<InputLabel
			:data-v-hidden='!label || !$slots.label || null'
			:for='id'
			:class='$style.label'
			:size
			:required
		>
			<slot name='label'>
				{{ label }}
			</slot>
		</InputLabel>

		<slot/>

		<p v-if='error' :class='$style.error'>
			<slot name='error'>
				{{ error }}
			</slot>
		</p>

		<p v-else-if='description || $slots.description' :class='$style.description'>
			<slot name='description'>
				{{ description }}
			</slot>
		</p>
	</div>
</template>

<style lang='postcss' module>
.root {
	--input-error-size: calc(var(--font-size-sm) - rem(2px));
	--input-description-size: calc(var(--font-size-sm) - rem(2px));

	line-height: var(--line-height);
}

.error,
.description {
	display: block;

	margin: 0;
	padding: 0;

	line-height: 1.2;
	overflow-wrap: break-word;
}

.error {
	font-size: var(--input-error-size);
	color: var(--color-error);
}

.description {
	font-size: var(--input-description-size, calc(var(--font-size-sm) - rem(2px)));
	color: var(--color-dimmed);
}
</style>
