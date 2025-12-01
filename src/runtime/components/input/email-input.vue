<script setup lang='ts'>
import type { TextInputProps } from './index'

import ActionIcon from '../action-icon/action-icon.vue'
import TextInput from './text-input.vue'


const props = defineProps<TextInputProps>()
</script>

<template>
	<TextInput type='email' v-bind='props'>
		<template #leftSection>
			<slot name='leftSection'>
				<ActionIcon variant='subtle'>
					<Icon name='gravity-ui:at' />
				</ActionIcon>
			</slot>
		</template>

		<template #rightSection>
			<slot name='rightSection' />
		</template>

		<template v-if='$slots.label' #label>
			<slot name='label' />
		</template>
		<template v-if='$slots.error' #error>
			<slot name='error' />
		</template>
		<template v-if='$slots.description' #description>
			<slot name='description' />
		</template>
	</TextInput>
</template>
