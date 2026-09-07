<script lang="ts" setup>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './data-list.module.css'
import { useDataListState } from './data-list.vue'


export interface DataListItemProps extends BoxProps {
}

const props = defineProps<DataListItemProps>()
const st = useDataListState()
</script>

<template>
	<Box v-bind='props' :class='[css.item, st.classes?.item]'>
		<slot />
	</Box>
</template>
