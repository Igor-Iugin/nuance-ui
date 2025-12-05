<script setup lang='ts'>
import type { Mod } from '@nui/utils'
import type { Component } from 'vue'

import { getMod, isFalsy } from '@nui/utils'
import { computed } from 'vue'


export interface BoxProps {
	is?: keyof HTMLElementTagNameMap | Component
	/** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
	mod?: Mod | Mod[] | Mod[][] | null
}

const { is = 'div', mod } = defineProps<BoxProps>()
const _mod = computed(() => {
	if (!mod)
		return null

	if (Array.isArray(mod)) {
		return mod
			.filter(i => !isFalsy(i))
			.reduce<Mod>((acc, value: Mod | Mod[]) => ({ ...acc, ...getMod(value) }), {})
	}

	return getMod(mod)
})
</script>

<template>
	<component :is v-bind='_mod'>
		<slot />
	</component>
</template>
