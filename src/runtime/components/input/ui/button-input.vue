<script setup lang='ts'>
import { unrefElement } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import type { InputBaseProps } from '../types'
import type { BaseInputProps } from './input-base.vue'
import type { InputWrapperProps } from './input-wrapper.vue'

import UnstyledButton from '../../button/unstyled-button.vue'
import InputBase from './input-base.vue'
import InputWrapper from './input-wrapper.vue'


export interface ButtonInputProps extends InputWrapperProps, BaseInputProps, InputBaseProps {
	/** If set, the input can have multiple lines, for example when `component="textarea"` @default `false` */
	multiline?: boolean

	name?: string
}

defineOptions({ inheritAttrs: false })

const props = defineProps<ButtonInputProps>()
const model = defineModel<unknown>()

const ref = useTemplateRef<HTMLElement>('button')
defineExpose({
	get $el() {
		return unrefElement(ref.value)
	},
})
</script>

<template>
	<InputWrapper v-bind='props'>
		<InputBase :class='$style.base'>
			<template v-if='!!$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>

			<template #default='{ id, css }'>
				<UnstyledButton
					:id
					ref='button'
					v-bind='{ ...$attrs, class: null }'
					:disabled
					:readonly
					:class='[css, $style.button]'
					:mod='{ multiline: props.multiline }'
				>
					<slot />
				</UnstyledButton>
				<input
					:id
					v-model='model'
					:name
					type='hidden'
					:required
					:disabled
					:readonly
				>
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

<style lang="postcss" module>
.base {
	--input-cursor: pointer;
}

.button {
	width: 100%;
	min-width: rem(150px);

	font-weight: 400;

	&:where([data-multiline]) {
		height: auto;
		padding-block: calc(var(--input-padding-inline-end) / 2);
	}
}

.section {
	font-size: var(--font-size-lg);
	color: var(--color-dimmed);
}
</style>
