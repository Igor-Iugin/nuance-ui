<script lang="ts" setup>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './data-list.module.css'


export interface DataListItemProps extends BoxProps {
}

const props = defineProps<DataListItemProps>()
</script>

<template>
	<Box v-bind='props' :class='css.item'>
		<slot />
	</Box>
</template>
