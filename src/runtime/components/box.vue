<script setup lang='ts'>
import type { Mod } from '@nui/composals'
import type { Component } from 'vue'

import { useMod } from '@nui/composals'
import { computed } from 'vue'


export interface BoxProps {
	is?: keyof HTMLElementTagNameMap | Component
	/** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
	mod?: Mod | Mod[] | Mod[][] | null
}

const { is = 'div', mod } = defineProps<BoxProps>()
const _mod = computed(() => useMod(mod))
</script>

<template>
	<component :is v-bind='_mod'>
		<slot />
	</component>
</template>
