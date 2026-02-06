<script lang='ts' setup>
import type { DialogTitleProps } from '../dialog'

import DialogTitle from '../dialog/ui/dialog-title.vue'


export interface ModalTitleProps extends DialogTitleProps {
}

const props = defineProps<ModalTitleProps>()
</script>

<template>
	<DialogTitle v-bind='props'>
		<slot />
	</DialogTitle>
</template>
