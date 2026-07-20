<script lang="ts">
import type { ModelRef } from 'vue'

import { createInjectionState } from '@vueuse/core'


export interface MenuCheckboxGroupState {
	/** Currently selected values */
	value: ModelRef<string[]>
	/** Adds or removes the value from the selection */
	onChange: (value: string, checked: boolean) => void
}

const [provideCheckboxGroup, useCheckboxGroup] = createInjectionState(
	(state: MenuCheckboxGroupState) => state,
	{ injectionKey: Symbol('nuance-menu-checkbox-group') },
)

export { provideCheckboxGroup }

export const useMenuCheckboxGroupState = useCheckboxGroup
</script>

<script lang="ts" setup>
const model = defineModel<string[]>({ default: () => [] })

provideCheckboxGroup({
	value: model,
	onChange(value: string, checked: boolean) {
		model.value = checked
			? [...model.value, value]
			: model.value.filter(v => v !== value)
	},
})
</script>

<template>
	<div role='group'>
		<slot />
	</div>
</template>
