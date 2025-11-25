<script setup lang='ts'>
import Renderless from '../renderless/renderless.vue'
import { usePopoverState } from './lib/context'


const { id, store: { targetRef }, disabled } = usePopoverState()
</script>

<template>
	<Renderless ref='targetRef' :disabled :popovertarget='id'>
		<slot/>
	</Renderless>
</template>
