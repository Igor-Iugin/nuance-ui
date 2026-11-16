<script setup lang='ts'>
import type { Classes, NuanceColor } from '@nui/types'

import { computed, useAttrs, useId, useSlots } from 'vue'

import type { InlineInputProps } from '../input'
import type { RadioControlProps } from './lib/use-radio'
import type { RadioVariant } from './radio-indicator.vue'

import InputInline from '../input/ui/input-inline.vue'
import { useRadio } from './lib/use-radio'
import RadioIndicator from './radio-indicator.vue'


export interface RadioProps extends RadioControlProps {
	id?: string
	label?: string
	description?: string
	error?: string
	labelPosition?: InlineInputProps['labelPosition']
	color?: NuanceColor
	/** Custom icon name. */
	icon?: string
	iconColor?: NuanceColor
	variant?: RadioVariant
	classes?: Classes<
		| 'root'
		| 'inner'
		| 'input'
		| 'icon'
		| 'indicator'
		| 'body'
		| 'wrapper'
		| 'label'
		| 'description'
		| 'error'
	>
}

defineOptions({ inheritAttrs: false })
const props = defineProps<RadioProps>()
/** Selected value, matching the native radio v-model contract. */
const model = defineModel<string | null>()
const attrs = useAttrs()
const slots = useSlots()
const generatedId = useId()
const id = computed(() => props.id ?? generatedId)
const {
	group,
	value,
	checked,
	disabled,
	readOnly,
	size,
	name,
	required,
	onChange,
	onClick,
	onKeydown,
} = useRadio(props, model)
const messageId = computed(() => props.error || slots.error
	? `${id.value}-error`
	: props.description || slots.description
		? `${id.value}-description`
		: undefined)
</script>

<template>
	<InputInline
		:id
		:label='props.label'
		:description='props.description'
		:error='props.error || ($slots.error ? " " : undefined)'
		:label-position='props.labelPosition'
		:disabled
		:size
		:class='[$style.root, props.classes?.root, attrs.class]'
		:style='attrs.style'
		:classes='props.classes'
	>
		<label :for='id' :class='[$style.inner, props.classes?.inner]'>
			<input
				v-bind='{ ...attrs, class: undefined, style: undefined }'
				:id
				type='radio'
				:class='[$style.input, props.classes?.input]'
				:value
				:name
				:checked
				:disabled
				:required
				:aria-readonly='readOnly || undefined'
				:aria-invalid='!!(props.error || $slots.error || group?.error.value) || undefined'
				:aria-describedby='[attrs["aria-describedby"], messageId, group?.describedBy.value].filter(Boolean).join(" ") || undefined'
				@change='onChange'
				@click='onClick'
				@keydown='onKeydown'
			>
			<RadioIndicator
				:data-error='!!(props.error || $slots.error || group?.error.value) || undefined'
				:checked
				:disabled
				:size
				:color='props.color'
				:icon='props.icon'
				:icon-color='props.iconColor'
				:variant='props.variant'
				:classes='{ root: props.classes?.indicator, icon: props.classes?.icon }'
			>
				<template
					v-if='$slots.icon'
					#default='state'
				>
					<slot name='icon' v-bind='state' />
				</template>
			</RadioIndicator>
		</label>
		<template v-if='props.label || $slots.label' #label>
			<slot name='label'>
				{{ props.label }}
			</slot>
		</template>
		<template v-if='props.description || $slots.description' #description>
			<span :id='`${id}-description`'>
				<slot name='description'>{{ props.description }}</slot>
			</span>
		</template>
		<template v-if='props.error || $slots.error' #error>
			<span :id='`${id}-error`' aria-live='polite'>
				<slot name='error'>{{ props.error }}</slot>
			</span>
		</template>
	</InputInline>
</template>

<style module src='./radio.module.css' />
