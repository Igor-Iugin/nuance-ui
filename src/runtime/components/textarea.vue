<script setup lang='ts'>
import { useTemplateRef } from 'vue'

import type { InputBaseProps, InputWrapperProps } from './input'

import { useAutosize } from '../composables/use-autosize'
import InputBase from './input/ui/input-base.vue'
import InputWrapper from './input/ui/input-wrapper.vue'


export interface TextareaProps extends InputWrapperProps, InputBaseProps {
	/** Icon displayed in the left section */
	icon?: string

	/** If set, enables textarea height growing with its content @default false */
	autosize?: boolean

	/** Maximum rows for autosize textarea to grow, ignored if `autosize` prop is not set */
	maxRows?: number

	/** Minimum rows of autosize textarea, ignored if `autosize` prop is not set */
	minRows?: number
}

const {
	icon,
	autosize = false,
	minRows,
	maxRows,
	...props
} = defineProps<TextareaProps>()

const model = defineModel<string>()
const inputRef = useTemplateRef<HTMLTextAreaElement>('input')

useAutosize(inputRef, {
	model,
	minRows,
	maxRows,
	enabled: autosize,
})

defineExpose({
	$el: inputRef,
})
</script>

<template>
	<InputWrapper v-bind='props' :multiline :class='$attrs?.class'>
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
	scrollbar-width: none;

	height: auto;
	-ms-overflow-style: none;

	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
