<script setup lang='ts'>
import { unrefElement } from '@vueuse/core'
import { computed, useId, useTemplateRef } from 'vue'

import type { InputBaseProps } from './types'
import type { InputWrapperProps } from './ui/input-wrapper.vue'

import BaseInput from './ui/input-base.vue'
import InputWrapper from './ui/input-wrapper.vue'


export interface TextInputProps extends InputWrapperProps, InputBaseProps {
	/** If set, the input can have multiple lines, for example when `component="textarea"` @default `false` */
	multiline?: boolean

	/** If set, `aria-` and other accessibility attributes are added to the input @default `true` */
	withAria?: boolean

	classes?: {
		wrapper?: string
		input?: string
	}
}

const { classes, id: uid, ...props } = defineProps<TextInputProps>()
const value = defineModel<string>({ default: '' })

const id = computed(() => uid ?? useId())

const ref = useTemplateRef<HTMLElement>('input')
defineExpose({
	get $el() {
		return unrefElement(ref.value)
	},
})
</script>

<template>
	<InputWrapper :id v-bind='props' :class='[$attrs.class, classes?.wrapper]'>
		<BaseInput
			:id
			ref='input'
			v-bind='{ ...$attrs, class: classes?.input }'
			v-model='value'
			:required
		>
			<template v-if='$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>
			<template v-if='$slots.rightSection' #rightSection>
				<slot name='rightSection' />
			</template>
		</BaseInput>

		<template v-if='$slots.label' #label>
			<slot name='label' />
		</template>
		<template v-if='$slots.error' #error>
			<slot name='error' />
		</template>
		<template v-if='$slots.description' #description>
			<slot name='description' />
		</template>
	</InputWrapper>
</template>
