<script setup lang='ts'>
import { ref } from 'vue'

import type { TextInputProps } from './index'

import ActionIcon from '../action-icon/action-icon.vue'
import TextInput from './text-input.vue'


const props = defineProps<TextInputProps>()
const password = ref<boolean>(true)
</script>

<template>
	<TextInput
		v-bind='props'
		:type='password ? "password" : "text"'
		right-section-p-e='all'
	>
		<template #rightSection>
			<slot name='rightSection'>
				<ActionIcon variant='subtle' @click='password = !password'>
					<Icon v-if='password' name='gravity-ui:eye' />
					<Icon v-else name='gravity-ui:eye-slash' />
				</ActionIcon>
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
