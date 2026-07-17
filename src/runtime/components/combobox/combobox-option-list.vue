<script setup lang='ts'>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './combobox.module.css'


export interface ComboboxOptionListProps extends BoxProps {
	/** Id of the element that labels the options list */
	labelledBy?: string
}

const { labelledBy, mod, ...rest } = defineProps<ComboboxOptionListProps>()
</script>

<template>
	<Box
		:mod
		v-bind='rest'
		:class='css.options'
		role='listbox'
		:aria-labelledby='labelledBy'
	>
		<slot />
	</Box>
</template>
