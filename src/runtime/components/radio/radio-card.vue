<script setup lang='ts'>
import type { Classes, NuanceRadius } from '@nui/types'

import { getRadius } from '@nui/utils'
import { computed, provide, useAttrs, useId } from 'vue'

import type { RadioControlProps } from './lib/use-radio'

import Box from '../box/box.vue'
import { radioCardKey } from './lib/context'
import { useRadio } from './lib/use-radio'


export interface RadioCardProps extends RadioControlProps {
	id?: string
	/** Shows a border around the card. @default true */
	withBorder?: boolean
	radius?: NuanceRadius
	classes?: Classes<'root' | 'input' | 'body'>
}

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<RadioCardProps>(), {
	withBorder: true,
})
const model = defineModel<string | null>()
const attrs = useAttrs()
const id = computed(() => props.id ?? useId())
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

provide(radioCardKey, { checked, disabled, size })
</script>

<template>
	<Box
		:class='[control.root, props.classes?.root, attrs.class]'
		:style='attrs.style'
		:mod='{ checked, disabled, "with-border": props.withBorder ?? true }'
	>
		<input
			v-bind='{ ...attrs, class: undefined, style: undefined }'
			:id
			type='radio'
			:class='[control.input, props.classes?.input]'
			:value
			:name
			:checked
			:disabled
			:required
			:aria-readonly='readOnly || undefined'
			:aria-invalid='group?.error.value || undefined'
			:aria-describedby='[attrs["aria-describedby"], group?.describedBy.value].filter(Boolean).join(" ") || undefined'
			@change='onChange'
			@click='onClick'
			@keydown='onKeydown'
		>
		<Box
			is='label'
			:for='id'
			:class='[$style.body, props.classes?.body]'
			:style='{ "--radio-card-radius": getRadius(props.radius) }'
			:mod='{ checked, disabled, "with-border": props.withBorder ?? true }'
		>
			<slot :checked :disabled />
		</Box>
	</Box>
</template>

<style module='control' src='./radio.module.css' />

<style module>
.body {
	cursor: pointer;

	display: block;

	box-sizing: border-box;
	inline-size: 100%;
	border: 1px solid transparent;
	border-radius: var(--radio-card-radius, var(--radius-default));

	&[data-with-border] {
		border-color: var(--color-gray-3);

		@mixin where-dark {
			border-color: var(--color-dark-4);
		}
	}

	&[data-checked] {
		border-color: var(--color-primary-filled);
	}

	&[data-disabled] {
		cursor: not-allowed;

		color: var(--color-dimmed);
	}
}
</style>
