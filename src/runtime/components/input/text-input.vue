<script setup lang='ts'>
import { useId } from 'vue'

import type { InputWrapperProps } from './ui/input-wrapper.vue'

import BaseInput from './ui/input-base.vue'
import InputWrapper from './ui/input-wrapper.vue'


export type TextInputProps = Omit<InputWrapperProps, 'id' | 'multiline' | 'resize'>

defineOptions({
	inheritAttrs: false,
})

const { required, ...props } = defineProps<TextInputProps>()
const model = defineModel<string | undefined>()

const id = useId()
</script>

<template>
	<InputWrapper :id v-bind='props' :class='$attrs?.class'>
		<slot name='label' />
		<slot name='error' />
		<slot name='description' />
		<BaseInput
			:id
			v-model='model'
			v-bind='{ ...$attrs, class: undefined }'
			:required
		>
			<template v-if='$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>
			<template v-if='$slots.rightSection' #rightSection>
				<slot name='rightSection' />
			</template>
		</BaseInput>
	</InputWrapper>
</template>
