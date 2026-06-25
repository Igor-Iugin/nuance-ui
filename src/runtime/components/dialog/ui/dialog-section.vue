<script lang='ts' setup>
import type { BoxProps } from '../../box.vue'

import Box from '../../box.vue'
import css from './dialog.module.css'


export interface DialogSectionProps extends BoxProps {
	bordered?: boolean
}

const { is = 'section', bordered, mod } = defineProps<DialogSectionProps>()
</script>

<template>
	<Box :is :mod='[{ bordered }, mod]' :class='css.section'>
		<slot />
	</Box>
</template>
