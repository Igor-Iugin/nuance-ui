<script setup lang='ts'>
import { unrefElement, useTextareaAutosize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import type { InputBaseProps, InputWrapperProps } from './input'

import InputBase from './input/ui/input-base.vue'
import InputWrapper from './input/ui/input-wrapper.vue'


export interface TextareaProps extends InputWrapperProps, InputBaseProps {
}

const props = defineProps<TextareaProps>()

const model = defineModel<string>()

const ref = useTemplateRef<HTMLTextAreaElement>('input')
const { input } = useTextareaAutosize({
	input: model.value,
	styleProp: 'minHeight',
	element: unrefElement(ref.value),
})

defineExpose({
	$el: unrefElement(ref.value),
})
</script>

<template>
	<InputWrapper v-bind='props' :multiline :class='$attrs?.class'>
		<InputBase>
			<template v-if='!!$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>

			<template #default='{ id, css }'>
				<textarea
					v-bind='{ ...$attrs, class: undefined }'
					:id
					ref='input'
					v-model='model'
					:class='[css, $style.textarea]'
					:required='props.required'
					:disabled='props.required'
					:readonly='props.readonly'
				/>
			</template>

			<template v-if='!!$slots.rightSection' #rightSection>
				<slot name='rightSection' />
			</template>
		</InputBase>

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

<style module>
.textarea {
	scrollbar-width: none;

	height: auto;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
