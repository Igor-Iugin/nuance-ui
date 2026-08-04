<script setup lang='ts'>
import type { Classes } from '@nui/types'

import { unrefElement } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import type { StyleProps } from '../box'
import type { InputSectionProps, InputStateProps } from './types'
import type { InputWrapperProps } from './ui/input-wrapper.vue'

import { extractStyleProps } from '../box'
import BaseInput from './ui/input-base.vue'
import InputWrapper from './ui/input-wrapper.vue'


export interface TextInputProps extends
	InputWrapperProps, InputStateProps, InputSectionProps, StyleProps {
	/**
	 * If set, the input can have multiple lines, for example when `is="textarea"`
	 * @default `false`
	 */
	multiline?: boolean

	/**
	 * If set, `aria-` and other accessibility attributes are added to the input
	 * @default `true`
	 */
	withAria?: boolean

	/** Styles API */
	classes?: Classes<'root' | 'input' | 'section'>
}

const {
	classes,
	icon,
	prefix,
	trailingIcon,
	postfix,
	...props
} = defineProps<TextInputProps>()

const value = defineModel<string>({ default: '' })

const { styles, rest } = extractStyleProps(props)

const ref = useTemplateRef<HTMLElement>('input')
defineExpose({
	get $el() {
		return unrefElement(ref.value)
	},
})
</script>

<template>
	<InputWrapper
		v-bind='rest'
		:class='[$attrs.class, classes?.root]'
	>
		<BaseInput
			v-bind='styles'
			:icon
			:prefix
			:trailing-icon
			:postfix
			:classes='{ root: classes?.input, section: classes?.section }'
		>
			<template v-if='!!$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>

			<template #default='{ id, css }'>
				<input
					v-bind='{ ...$attrs, class: css }'
					:id
					ref='input'
					v-model='value'
					:required
					:disabled
					:readonly
				>
			</template>

			<template v-if='!!$slots.rightSection' #rightSection>
				<slot name='rightSection' />
			</template>
		</BaseInput>

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
