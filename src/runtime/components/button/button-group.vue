<script setup lang='ts'>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './button.module.css'


export interface ButtonGroupProps extends BoxProps {
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
} = defineProps<ButtonGroupProps>()
</script>

<template>
	<Box
		:is
		:mod='[mod, { orientation }]'
		v-bind='rest'
		:class='css.group'
		role='group'
	>
		<slot />
	</Box>
</template>
