<script setup lang='ts'>
import { useTextareaAutosize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import type { InputBaseProps, InputWrapperProps } from './input'

import InputBase from './input/ui/input-base.vue'
import InputWrapper from './input/ui/input-wrapper.vue'


export interface TextareaProps extends InputWrapperProps, InputBaseProps {
	/** Icon displayed in the left section */
	icon?: string

	/** If set, enables textarea height growing with its content @default false */
	autosize?: boolean
}

const {
	icon,
	autosize = false,
	multiline = true,
	resize,
	...props
} = defineProps<TextareaProps>()

const model = defineModel<string>({ default: '' })
const inputRef = useTemplateRef<HTMLTextAreaElement>('input')

if (autosize) {
	useTextareaAutosize({
		element: inputRef,
		input: model,
	})
}

defineExpose({
	$el: inputRef,
})
</script>

<template>
	<InputWrapper
		v-bind='props'
		:multiline
		:class='$attrs?.class'
		:resize='autosize ? undefined : resize'
	>
		<InputBase :classes='{ root: $style.test }'>
			<template v-if='!!$slots.leftSection || icon' #leftSection>
				<slot name='leftSection'>
					<Icon v-if='icon' :name='icon' />
				</slot>
			</template>

			<template #default='{ id, css }'>
				<textarea
					v-bind='{ ...$attrs, class: undefined }'
					:id
					ref='input'
					v-model='model'
					:class='[css, $style.textarea]'
					:required='props.required'
					:disabled='props.disabled'
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
	--input-padding-y: var(--input-padding-inline-start);

	scrollbar-width: none;

	height: auto;
	min-height: rem(62px);

	line-height: 1.2;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
