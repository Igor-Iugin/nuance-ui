<script lang='ts' setup>
import type { DialogTitleProps } from '../dialog'

import DialogTitle from '../dialog/dialog-title.vue'


export interface ModalTitleProps extends /* @vue-ignore */ DialogTitleProps {
}

const props = defineProps<ModalTitleProps>()
</script>

<template>
	<DialogTitle v-bind='props'>
		<slot />
	</DialogTitle>
</template>
