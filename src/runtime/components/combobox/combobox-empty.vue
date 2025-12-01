<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import css from './combobox.module.css'


export interface ComboboxEmptyProps extends BoxProps {
}

const { is, mod } = defineProps<ComboboxEmptyProps>()
</script>

<template>
	<Box :is :mod :class='css.empty'>
		<slot />
	</Box>
</template>
