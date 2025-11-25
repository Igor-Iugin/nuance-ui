<script setup lang="ts">
import { Slot } from './renderless-slot'


defineOptions({
	inheritAttrs: false,
})
</script>

<template>
	<Slot v-bind='$attrs'>
		<slot/>
	</Slot>
</template>
