<script lang="ts" setup>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './data-list.module.css'


export interface DataListItemValueProps extends Omit<BoxProps, 'is'> {
}

const props = defineProps<DataListItemValueProps>()
</script>

<template>
	<Box v-bind='props' is='dd' :class='css.value'>
		<slot />
	</Box>
</template>
