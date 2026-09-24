<script setup lang='ts'>
import { useConfig } from '@nui/composables'
import { ref } from 'vue'

import type { TextInputProps } from './index'

import Button from '../button/button.vue'
import TextInput from './text-input.vue'


const props = defineProps<TextInputProps>()
const password = ref<boolean>(true)
const { icons } = useConfig()
</script>

<template>
	<TextInput
		v-bind='props'
		:type='password ? "password" : "text"'
		right-section-p-e='all'
	>
		<template #rightSection>
			<slot name='rightSection'>
				<Button square variant='subtle' color='gray' @click='password = !password'>
					<Icon :name='password ? icons.passwordShow : icons.passwordHide' />
				</Button>
			</slot>
		</template>

		<template v-if='!!$slots.leftSection' #leftSection>
			<slot name='leftSection' />
		</template>

		<template v-if='!!$slots.label' #label>
			<slot name='label' />
		</template>
		<template v-if='!!$slots.error' #error>
			<slot name='error' />
		</template>
		<template v-if='!!$slots.description' #description>
			<slot name='description' />
		</template>
	</TextInput>
</template>
