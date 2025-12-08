<script setup lang='ts'>
import type { BoxProps } from '@nui/components'

import Box from '../box.vue'
import css from './progress.module.css'


const props = defineProps<BoxProps>()
</script>

<template>
	<Box v-bind='props' :class='css.label'>
		<slot />
	</Box>
</template>
