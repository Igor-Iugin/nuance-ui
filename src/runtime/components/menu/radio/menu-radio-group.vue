<script lang="ts">
import type { ModelRef } from 'vue'

import { createInjectionState } from '@vueuse/core'


export interface MenuRadioGroupState {
	/** Currently selected value */
	value: ModelRef<string | undefined>
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
const model = defineModel<string>()

provideRadioGroup({
	value: model,
	onChange(value: string) {
		model.value = value
	},
})
</script>

<template>
	<div role='group'>
		<slot />
	</div>
</template>
