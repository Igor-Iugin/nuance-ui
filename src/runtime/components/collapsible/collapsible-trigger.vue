<script setup lang='ts'>
import Renderless from '../renderless/renderless.vue'
import { useCollapsibleState } from './collapsible-root.vue'


const ctx = useCollapsibleState()
</script>

<template>
	<Renderless
		:mod='{
			disabled: ctx.disabled?.value,
			state: ctx.open.value ? "open" : "closed",
		}'
		:aria-controls='ctx.contentId'
		:aria-expanded='ctx.open.value'
		:disabled='ctx.disabled?.value'
		@click='ctx.onOpenToggle()'
	>
		<slot />
	</Renderless>
</template>
