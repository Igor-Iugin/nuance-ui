<script lang='ts' setup>
import type { DialogFooterProps } from '../dialog'

import DialogFooter from '../dialog/ui/dialog-footer.vue'


const props = defineProps<DialogFooterProps>()
</script>

<template>
	<DialogFooter v-bind='props'>
		<slot />
	</DialogFooter>
</template>
