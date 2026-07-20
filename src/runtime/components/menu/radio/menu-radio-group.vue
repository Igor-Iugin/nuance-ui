<script lang="ts">
import { createInjectionState } from '@vueuse/core'


export interface MenuRadioGroupState {
	/** Currently selected value */
	value: string | undefined
	/** Selects the given value */
	onChange: (value: string) => void
}


const [provideRadioGroup, useRadioGroup] = createInjectionState(
	(state: MenuRadioGroupState) => state,
	{ injectionKey: Symbol('nuance-menu-radio-group') },
)

export const useMenuRadioGroupState = useRadioGroup
</script>

<script lang="ts" setup>
import { reactive } from 'vue'


defineSlots<{
	/** Radio items */
	default?: () => any
}>()

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
