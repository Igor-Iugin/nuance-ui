<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import css from './action-icon.module.css'


export interface ActionIconGroupProps extends BoxProps {
	orientation?: 'horizontal' | 'vertical'
}

const { mod, orientation = 'horizontal', is } = defineProps<ActionIconGroupProps>()
</script>

<template>
	<Box :is :class='css.group' :mod='[mod, { orientation }]' role='group'>
		<slot />
	</Box>
</template>
