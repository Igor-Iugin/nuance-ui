<script lang='ts' setup>
import type { ActionIconProps } from '../action-icon'

import { DialogCloseButton } from '../dialog'


const props = defineProps<ActionIconProps>()
</script>

<template>
	<DialogCloseButton v-bind='props'>
		<slot />
	</DialogCloseButton>
</template>
