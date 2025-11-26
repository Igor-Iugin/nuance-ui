<script lang='ts' setup>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import css from './dialog.module.css'


export interface DialogHeaderProps extends /* @vue-ignore */ Omit<BoxProps, 'is'> {
}

const props = defineProps<DialogHeaderProps>()
</script>

<template>
	<Box is='header' :class='css.header' v-bind='props'>
		<slot />
	</Box>
</template>
