<script setup lang='ts'>
import type { TextInputProps } from './index'

import TextInput from './text-input.vue'


const props = defineProps<TextInputProps>()
</script>

<template>
	<TextInput type='email' v-bind='props'>
		<template #leftSection>
			<slot name='leftSection'>
				<Icon name='gravity-ui:at' />
			</slot>
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
