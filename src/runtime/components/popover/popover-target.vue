<script setup lang='ts'>
import Renderless from '../renderless/renderless.vue'
import { usePopoverState } from './lib/context'


const { disable = false } = defineProps<{
	/** Disables auto click targeting @default `false` */
	disable?: boolean
}>()

const { id, store: { targetRef, opened }, disabled } = usePopoverState()
</script>

<template>
	<Renderless
		ref='targetRef'
		:disabled
		:popovertarget='id'
		@click.stop.prevent='!disable && !disabled && (opened = !opened)'
	>
		<slot />
	</Renderless>
</template>
