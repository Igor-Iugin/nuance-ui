<script setup lang='ts'>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './action-icon.module.css'


export interface ActionIconGroupProps extends BoxProps {
	/**
	 * Layout direction of the group
	 * @default 'horizontal'
	 */
	orientation?: 'horizontal' | 'vertical'
}

const {
	is,
	mod,
	orientation = 'horizontal',
	...rest
} = defineProps<ActionIconGroupProps>()
</script>

<template>
	<Box
		:is
		:mod='[mod, { orientation }]'
		:class='css.group'
		v-bind='rest'
		role='group'
	>
		<slot />
	</Box>
</template>
