<script lang='ts' setup>
import type { ButtonProps } from '../button'

import DialogCloseButton from '../dialog/ui/dialog-close-button.vue'


const props = defineProps<ButtonProps>()
</script>

<template>
	<DialogCloseButton v-bind='props'>
		<slot />
	</DialogCloseButton>
</template>
