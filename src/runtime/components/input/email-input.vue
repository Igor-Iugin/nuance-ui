<script setup lang='ts'>
import { useConfig } from '@nui/composables'
import { computed } from 'vue'

import type { TextInputProps } from './index'

import TextInput from './text-input.vue'


const { icon: _icon, ...rest } = defineProps<TextInputProps>()

const { icons } = useConfig()
const icon = computed(() => _icon ?? icons.email)
</script>

<template>
	<TextInput type='email' :icon='icon' v-bind='rest'>
		<template v-if='!!$slots.leftSection' #leftSection>
			<slot name='leftSection' />
		</template>

		<template v-if='!!$slots.rightSection' #rightSection>
			<slot name='rightSection' />
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
