<script setup lang='ts'>
import { unrefElement } from '@vueuse/core'
import { useId, useTemplateRef } from 'vue'

import type { InputBaseProps } from './types'
import type { InputWrapperProps } from './ui/input-wrapper.vue'

import Button from '../button/button.vue'
import InputWrapper from './ui/input-wrapper.vue'


export interface ButtonInputProps extends InputWrapperProps, InputBaseProps {
	/** If set, the input can have multiple lines, for example when `component="textarea"` @default `false` */
	multiline?: boolean

	/** If set, `aria-` and other accessibility attributes are added to the input @default `true` */
	withAria?: boolean
}

const { id, ...rest } = defineProps<ButtonInputProps>()
const value = defineModel<any>()

const ref = useTemplateRef('button')

const uid = id ?? useId()

defineExpose({
	get $el() {
		return unrefElement(ref.value) as HTMLElement
	},
})
</script>

<template>
	<InputWrapper :id='uid' v-bind='rest'>
		<Button :id='uid' v-bind='$attrs' ref='button' :class='$style.button'>
			<template v-if='!!$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>
			<slot>
				{{ value }}
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
}
</style>
