<script lang='ts' setup>
import type { DialogTitleProps } from '../dialog'

import DialogTitle from '../dialog/dialog-title.vue'


export interface DrawerTitleProps extends /* @vue-ignore */ DialogTitleProps {
}

const props = defineProps<DrawerTitleProps>()
</script>

<template>
	<DialogTitle v-bind='props'>
		<slot />
	</DialogTitle>
</template>
