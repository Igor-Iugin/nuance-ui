<script lang='ts' setup>
import type { DialogHeaderProps } from '../dialog'
import { DialogHeader } from '../dialog'


export interface DrawerHeaderProps extends DialogHeaderProps {
}

const props = defineProps<DrawerHeaderProps>()
</script>

<template>
	<DialogHeader v-bind='props'>
		<slot/>
	</DialogHeader>
</template>
