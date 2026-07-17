<script lang='ts' setup>
import type { BoxProps } from '../../box/box.vue'

import Box from '../../box/box.vue'
import css from './dialog.module.css'


export interface DialogFooterProps extends BoxProps {
}

const { is = 'footer', ...rest } = defineProps<DialogFooterProps>()
</script>

<template>
	<Box :is v-bind='rest' :class='css.footer'>
		<slot />
	</Box>
</template>
