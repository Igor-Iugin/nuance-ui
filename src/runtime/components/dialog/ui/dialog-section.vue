<script lang='ts' setup>
import type { BoxProps } from '../../box/box.vue'

import Box from '../../box/box.vue'
import css from './dialog.module.css'


export interface DialogSectionProps extends BoxProps {
	bordered?: boolean
}

const { is = 'section', bordered, mod, ...rest } = defineProps<DialogSectionProps>()
</script>

<template>
	<Box :is :mod='[{ bordered }, mod]' v-bind='rest' :class='css.section'>
		<slot />
	</Box>
</template>
