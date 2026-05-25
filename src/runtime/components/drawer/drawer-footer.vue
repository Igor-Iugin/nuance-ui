<script lang='ts' setup>
import type { DialogFooterProps } from '../dialog'

import DialogFooter from '../dialog/ui/dialog-footer.vue'


export interface DrawerFooterProps extends DialogFooterProps {
}

const props = defineProps<DrawerFooterProps>()
</script>

<template>
	<DialogFooter v-bind='props'>
		<slot />
	</DialogFooter>
</template>
