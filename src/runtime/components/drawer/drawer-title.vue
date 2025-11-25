<script lang='ts' setup>
import type { DialogTitleProps } from '../dialog'

import { DialogTitle } from '../dialog'


export interface DrawerTitleProps extends DialogTitleProps {
}

const props = defineProps<DrawerTitleProps>()
</script>

<template>
	<DialogTitle v-bind='props'>
		<slot />
	</DialogTitle>
</template>
