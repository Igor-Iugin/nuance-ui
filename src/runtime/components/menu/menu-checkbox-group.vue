<script lang="ts">
export interface MenuCheckboxGroupSlots {
	/** Checkbox items */
	default?: () => any
}
</script>

<script lang="ts" setup>
import { reactive } from 'vue'

import { provideCheckboxGroup } from './lib/selectable-context.js'


defineSlots<MenuCheckboxGroupSlots>()

const model = defineModel<string[]>({ default: () => [] })

provideCheckboxGroup(reactive({
	get value() {
		return model.value
	},
	onChange(value: string, checked: boolean) {
		model.value = checked
			? [...model.value, value]
			: model.value.filter(v => v !== value)
	},
}))
</script>

<template>
	<div role='group'>
		<slot />
	</div>
</template>
