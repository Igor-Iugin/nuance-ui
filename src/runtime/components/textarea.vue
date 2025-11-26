<script setup lang='ts'>
import { useTextareaAutosize } from '@vueuse/core'
import { useId, useTemplateRef } from 'vue'

import type { InputWrapperProps } from './input'

import InputBase from './input/ui/input-base.vue'
import InputWrapper from './input/ui/input-wrapper.vue'


export interface TextareaProps extends /* @vue-ignore */ Omit<InputWrapperProps, 'id'> {
}

const props = defineProps<TextareaProps>()

const modelValue = defineModel<string>()

const inputRef = useTemplateRef('inputRef')
const { input } = useTextareaAutosize({
	input: modelValue.value,
	styleProp: 'minHeight',
	element: inputRef.value?.ref as HTMLTextAreaElement,
})

const id = useId()
</script>

<template>
	<InputWrapper :id v-bind='props' :multiline :class='$attrs?.class'>
		<template #label>
			<slot name='label' />
		</template>
		<template #error>
			<slot name='error' />
		</template>
		<template #description>
			<slot name='description' />
		</template>

		<InputBase
			is='textarea'
			v-bind='{ ...$attrs, id, class: $style.input }'
			ref='inputRef'
			v-model='input'
			:required='props?.required'
		>
			<template #leftSection>
				<slot name='leftSection' />
			</template>
			<template #rightSection>
				<slot name='rightSection' />
			</template>
		</InputBase>
	</InputWrapper>
</template>

<style module>
.input {
	scrollbar-width: none;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
