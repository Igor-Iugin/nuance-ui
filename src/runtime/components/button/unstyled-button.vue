<script setup lang='ts'>
import type { BoxProps } from '../box.vue'
import type { InputBaseProps } from '../input'

import Box from '../box.vue'


interface UnstyledButtonProps extends InputBaseProps, BoxProps {
}

const { is = 'button', ...props } = defineProps<UnstyledButtonProps>()
</script>

<template>
	<Box :is v-bind='props' :class='$style.root' type='button'>
		<slot />
	</Box>
</template>

<style module lang='postcss'>
.root {
	touch-action: manipulation;
	cursor: pointer;

	padding: 0;
	border: 0;

	font-size: var(--font-size-md);
	color: inherit;
	text-align: left;
	text-decoration: none;

	appearance: none;
	background-color: transparent;
	-webkit-tap-highlight-color: transparent;

	@mixin where-rtl {
		text-align: right;
	}
}
</style>
