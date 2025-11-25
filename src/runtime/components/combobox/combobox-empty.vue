<script setup lang='ts'>
import type { BoxProps } from '../box.vue'
import Box from '../box.vue'
import css from './combobox.module.css'


export interface ComboboxEmptyProps extends Omit<BoxProps, 'is'> {
}

const { mod } = defineProps<ComboboxEmptyProps>()
</script>

<template>
	<Box :mod :class='css.empty'>
		<slot/>
	</Box>
</template>
