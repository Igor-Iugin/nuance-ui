<script lang='ts' setup>
import type { DialogHeaderProps } from '../dialog'

import DialogHeader from '../dialog/ui/dialog-header.vue'


const props = defineProps<DialogHeaderProps>()
</script>

<template>
	<DialogHeader v-bind='props'>
		<slot />
	</DialogHeader>
</template>
