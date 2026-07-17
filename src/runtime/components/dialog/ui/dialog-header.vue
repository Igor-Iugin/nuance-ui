<script lang='ts' setup>
import type { BoxProps } from '../../box/box.vue'

import Box from '../../box/box.vue'
import css from './dialog.module.css'


export interface DialogHeaderProps extends BoxProps {
}

const { is = 'header', ...rest } = defineProps<DialogHeaderProps>()
</script>

<template>
	<Box :is v-bind='rest' :class='css.header'>
		<slot />
	</Box>
</template>
