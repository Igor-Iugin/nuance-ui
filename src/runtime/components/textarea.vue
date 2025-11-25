<script setup lang='ts'>
import { useTextareaAutosize } from '@vueuse/core'
import { useId } from 'vue'

import type { InputWrapperProps } from './input'

import { BaseInput, InputWrapper } from './input'


export interface TextareaProps extends Omit<InputWrapperProps, 'id'> {
}

const props = defineProps<TextareaProps>()

const modelValue = defineModel<string>()

const { textarea, input } = useTextareaAutosize({
	input: modelValue.value,
	styleProp: 'minHeight',
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

		<BaseInput
			is='textarea'
			v-bind='{ ...$attrs, id, class: $style.input }'
			ref='textarea'
			v-model='input'
			:required='props?.required'
		>
			<template #leftSection>
				<slot name='leftSection' />
			</template>
			<template #rightSection>
				<slot name='rightSection' />
			</template>
		</BaseInput>
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
