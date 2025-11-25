<script lang='ts' setup>
import type { BoxProps } from '../box.vue'
import NBox from '../box.vue'
import css from './dialog.module.css'


export interface DialogHeaderProps extends Omit<BoxProps, 'is'> {
}

const props = defineProps<DialogHeaderProps>()
</script>

<template>
	<NBox is='header' :class='css.header' v-bind='props'>
		<slot />
	</NBox>
</template>
