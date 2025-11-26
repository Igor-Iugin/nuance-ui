<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import css from './button.module.css'


export interface ButtonGroupProps extends /* @vue-ignore */ BoxProps {
	orientation?: 'horizontal' | 'vertical'
}

const { is, mod, orientation = 'horizontal' } = defineProps<ButtonGroupProps>()
</script>

<template>
	<Box :is :mod='[mod, { orientation }]' :class='css.group' role='group'>
		<slot />
	</Box>
</template>
