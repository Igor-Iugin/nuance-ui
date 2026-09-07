<script lang="ts" setup>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './data-list.module.css'
import { useDataListState } from './data-list.vue'


export interface DataListItemValueProps extends Omit<BoxProps, 'is'> {
}

const props = defineProps<DataListItemValueProps>()
const st = useDataListState()
</script>

<template>
	<Box v-bind='props' is='dd' :class='[css.value, st.classes.value?.value]'>
		<slot />
	</Box>
</template>
