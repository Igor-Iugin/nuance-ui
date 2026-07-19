<script lang="ts">
export interface MenuRadioGroupSlots {
	/** Radio items */
	default?: () => any
}
</script>

<script lang="ts" setup>
import { reactive } from 'vue'

import { provideRadioGroup } from './lib/selectable-context.js'


defineSlots<MenuRadioGroupSlots>()

const model = defineModel<string>()

provideRadioGroup(reactive({
	get value() {
		return model.value
	},
	onChange(value: string) {
		model.value = value
	},
}))
</script>

<template>
	<div role='group'>
		<slot />
	</div>
</template>
