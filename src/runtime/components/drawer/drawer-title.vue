<script lang='ts' setup>
import type { DialogTitleProps } from '../dialog'

import DialogTitle from '../dialog/ui/dialog-title.vue'


export interface DrawerTitleProps extends DialogTitleProps {
}

const props = defineProps<DrawerTitleProps>()
</script>

<template>
	<DialogTitle v-bind='props'>
		<slot />
	</DialogTitle>
</template>
