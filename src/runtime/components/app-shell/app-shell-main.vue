<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'


const { mod } = defineProps<BoxProps>()
</script>

<template>
	<Box is='main' :mod :class='$style.root'>
		<slot />
	</Box>
</template>

<style module lang='postcss'>
.root {
	display: grid;
	align-content: flex-start;

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
