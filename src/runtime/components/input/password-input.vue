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
			<ActionIcon variant='subtle' @click='password = !password'>
				<Icon v-if='password' name='gravity-ui:eye' />
				<Icon v-else name='gravity-ui:eye-slash' />
			</ActionIcon>
		</template>
	</TextInput>
</template>
