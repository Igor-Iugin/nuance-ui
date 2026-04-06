<script setup lang='ts'>
import type { TextInputProps } from './index'

import TextInput from './text-input.vue'


const { icon = 'gravity-ui:at', ...rest } = defineProps<TextInputProps>()
</script>

<template>
	<TextInput type='email' :icon v-bind='rest'>
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
