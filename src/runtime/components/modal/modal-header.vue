<script lang='ts' setup>
import type { DialogHeaderProps } from '../dialog'

import { DialogHeader } from '../dialog'


export interface ModalHeaderProps extends DialogHeaderProps {
}

const props = defineProps<ModalHeaderProps>()
</script>

<template>
	<DialogHeader v-bind='props'>
		<slot />
	</DialogHeader>
</template>
