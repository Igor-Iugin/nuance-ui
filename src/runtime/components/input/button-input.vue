<script setup lang='ts' generic='Value = string'>
import { unrefElement } from '@vueuse/core'
import { useId, useTemplateRef } from 'vue'

import type { InputBaseProps } from './types'
import type { InputWrapperProps } from './ui/input-wrapper.vue'

import Button from '../button/button.vue'
import InputWrapper from './ui/input-wrapper.vue'


export interface ButtonInputProps<T = string> extends InputWrapperProps, InputBaseProps {
	/** If set, the input can have multiple lines, for example when `component="textarea"` @default `false` */
	multiline?: boolean

	/** If set, `aria-` and other accessibility attributes are added to the input @default `true` */
	withAria?: boolean

	/** Getter function for visible value */
	getValue?: (value: T) => string
}

defineOptions({ inheritAttrs: false })

const {
	id,
	getValue,
	...rest
} = defineProps<ButtonInputProps<Value>>()

const uid = id ?? useId()
const value = defineModel<Value>({ required: true })

const ref = useTemplateRef<HTMLElement>('button')
defineExpose({
	get $el() {
		return unrefElement(ref.value)
	},
})
</script>

<template>
	<InputWrapper :id='uid' v-bind='rest'>
		<Button
			:id='uid'
			v-bind='$attrs'
			ref='button'
			:classes='{
				root: $style.button,
				section: $style.section,
			}'
			:mod='{ multiline: rest.multiline }'
		>
			<template v-if='!!$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>

			<slot>
				{{ getValue?.(value) ?? value }}
			</slot>

			<template v-if='!!$slots.rightSection' #rightSection>
				<slot name='rightSection' />
			</template>
		</Button>

		<template v-if='!!$slots.label' #label>
			<slot name='label' />
		</template>
		<template v-if='!!$slots.error' #error>
			<slot name='error' />
		</template>
		<template v-if='!!$slots.description' #description>
			<slot name='description' />
		</template>
	</InputWrapper>
</template>

<style lang="postcss" module>
.button {
	width: 100%;
	min-width: rem(150px);

	font-weight: 400;

	&:where([data-multiline]) {
		height: auto;
		min-height: calc(var(--button-height) + var(--button-padding-x) / 2);
		padding-block: calc(var(--button-padding-x) / 2);
	}
}

.section {
	font-size: var(--font-size-lg);
	color: var(--color-dimmed);
}
</style>
