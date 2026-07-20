<script setup lang='ts'>
import Renderless from '../renderless/renderless.vue'
import { usePopoverState } from './lib/context'


const { manual = false } = defineProps<{
	/** Disables auto click targeting @default `false` */
	manual?: boolean
}>()

const { id, store: { targetRef, opened }, disabled } = usePopoverState()
</script>

<template>
	<Renderless
		ref='targetRef'
		:disabled
		:popovertarget='id'
		@click.stop.prevent='!manual && !disabled && (opened = !opened)'
	>
		<slot />
	</Renderless>
</template>
