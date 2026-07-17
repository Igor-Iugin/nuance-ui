<script setup lang='ts'>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'


const { is = 'main', ...rest } = defineProps<BoxProps>()
</script>

<template>
	<Box :is v-bind='rest' :class='$style.root'>
		<slot />
	</Box>
</template>

<style module>
.root {
	min-height: 100dvh;
	padding-top: calc(var(--app-shell-header-offset, 0rem) + var(--app-shell-padding));
	padding-bottom: calc(var(--app-shell-footer-offset, 0rem) + var(--app-shell-padding));
	padding-inline-start: calc(var(--app-shell-navbar-offset, 0rem) + var(--app-shell-padding));
	padding-inline-end: calc(var(--app-shell-aside-offset, 0rem) + var(--app-shell-padding));

	transition-timing-function: var(--app-shell-transition-timing-function);
	transition-duration: var(--app-shell-transition-duration);

	transition-property: padding;
}
</style>
