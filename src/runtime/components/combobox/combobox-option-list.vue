<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import css from './combobox.module.css'


export interface ComboboxOptionListProps extends /* @vue-ignore */ Omit<BoxProps, 'is'> {
	/** Id of the element that labels the options list */
	labelledBy?: string
}

const { labelledBy, mod } = defineProps<ComboboxOptionListProps>()
</script>

<template>
	<Box :class='css.options' role='listbox' :aria-labelledby='labelledBy' :mod>
		<slot />
	</Box>
</template>
