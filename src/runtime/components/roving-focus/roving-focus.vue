<script setup lang='ts'>
import { nextTick, onMounted, useTemplateRef } from 'vue'

import Renderless from '../renderless/renderless.vue'
import { useProvideRovingFocus } from './_lib/context'


export interface RovingFocusProps {
	/** Loop focus from last to first and vice versa */
	loop?: boolean
	/** Allowed arrow key directions */
	orientation?: 'vertical' | 'horizontal' | 'both'
	/** Custom attribute instead of data-roving-item */
	attr?: string
}

const { loop = false, orientation = 'vertical' } = defineProps<RovingFocusProps>()

const list = useTemplateRef<HTMLElement>('list')
const { init } = useProvideRovingFocus({
	list,
	loop,
	orientation,
})

onMounted(() => nextTick(() => init()))
</script>

<template>
	<Renderless ref='list'>
		<slot />
	</Renderless>
</template>
