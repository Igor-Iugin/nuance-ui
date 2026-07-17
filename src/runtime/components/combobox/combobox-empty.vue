<script setup lang='ts'>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './combobox.module.css'


export interface ComboboxEmptyProps extends BoxProps {
}

const props = defineProps<ComboboxEmptyProps>()
</script>

<template>
	<Box v-bind='props' :class='css.empty'>
		<slot />
	</Box>
</template>
