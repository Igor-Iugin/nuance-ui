<script setup lang='ts'>
import { useId } from 'vue'

import type { InputBaseProps } from './types'
import type { InputWrapperProps } from './ui/input-wrapper.vue'

import BaseInput from './ui/input-base.vue'
import InputWrapper from './ui/input-wrapper.vue'


export interface InputProps extends InputWrapperProps, InputBaseProps {
	/** If set, the input can have multiple lines, for example when `component="textarea"` @default `false` */
	multiline?: boolean

	/** If set, `aria-` and other accessibility attributes are added to the input @default `true` */
	withAria?: boolean
}

const { id, ...rest } = defineProps<InputProps>()
const value = defineModel<any>()

const uid = id ?? useId()
</script>

<template>
	<InputWrapper :id='uid' v-bind='rest'>
		<BaseInput :id='uid' v-model='value' v-bind='$attrs'>
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
