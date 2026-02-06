<script lang='ts' setup>
import type { BoxProps } from '../../box.vue'

import Box from '../../box.vue'
import css from './dialog.module.css'


export interface DialogHeaderProps extends BoxProps {
}

const { is = 'header', mod } = defineProps<DialogHeaderProps>()
</script>

<template>
	<Box :is :mod :class='css.header'>
		<slot />
	</Box>
</template>
