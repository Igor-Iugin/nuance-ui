<script lang='ts' setup>
import type { DialogHeaderProps } from '../dialog'

import DialogHeader from '../dialog/dialog-header.vue'


export interface ModalHeaderProps extends /* @vue-ignore */ DialogHeaderProps {
}

const props = defineProps<ModalHeaderProps>()
</script>

<template>
	<DialogHeader v-bind='props'>
		<slot />
	</DialogHeader>
</template>
