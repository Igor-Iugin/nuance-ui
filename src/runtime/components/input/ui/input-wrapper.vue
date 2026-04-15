<script lang='ts' setup>
import { getFontSize } from '@nui/utils'
import { computed, reactive, toRefs, useId } from 'vue'

import type { WrapperContext } from '../lib/input-wrapper.context'

import { useProvideInputWrapper } from '../lib/input-wrapper.context'
import InputLabel from './input-label.vue'


export interface InputWrapperProps extends WrapperContext {
	/** Error message displayed below the input */
	error?: string

	/** Helper text displayed below the input */
	description?: string

	/** Label displayed above the input */
	label?: string

	/** Marks the field as required */
	required?: boolean
}

const props = withDefaults(defineProps<InputWrapperProps>(), {
	variant: 'default',
	size: 'sm',
	radius: 'sm',
})

const uid = props.id ?? useId()

useProvideInputWrapper(reactive({ ...toRefs(props), id: uid }))

const style = computed(() => ({
	'--input-error-size': `calc(${getFontSize(props.size)} - .125rem)`,
	'--input-description-size': `calc(${getFontSize(props.size)} - .125rem)`,
}))
</script>

<template>
	<div :style :class='$style.wrapper'>
		<InputLabel
			:data-v-hidden='(!label && !$slots.label) || null'
			:for='uid'
			:class='$style.label'
			:size
			:required
		>
			<slot name='label'>
				{{ label }}
			</slot>
		</InputLabel>

		<slot />

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

<style module>
.wrapper {
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
