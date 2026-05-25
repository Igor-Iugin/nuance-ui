<script lang='ts' setup>
import type { BoxProps } from '../../box.vue'

import Box from '../../box.vue'
import css from './dialog.module.css'


export interface DialogFooterProps extends BoxProps {
}

const { is = 'footer', mod } = defineProps<DialogFooterProps>()
</script>

<template>
	<ClientOnly>
		<Box :is :mod :class='css.footer'>
			<slot />
		</Box>
	</ClientOnly>
</template>
