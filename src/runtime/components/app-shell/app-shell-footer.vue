<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'


const { mod } = defineProps<BoxProps>()
</script>

<template>
	<Box is='footer' :mod :class='$style.root'>
		<slot />
	</Box>
</template>

<style module lang='postcss'>
.root {
	position: fixed;
	z-index: 1;

	bottom: 0;
	inset-inline: 0;
	transform: var(--app-shell-footer-transform);

	height: calc(var(--app-shell-footer-height) + env(safe-area-inset-bottom));
	padding-bottom: env(safe-area-inset-bottom);

	background-color: var(--color-body);

	transition-timing-function: var(--app-shell-transition-timing-function);
	transition-duration: var(--app-shell-transition-duration);
	transition-property: transform, left, right;

	:where([data-layout='alt']) > & {
		inset-inline-start: var(--app-shell-navbar-offset, 0rem);
		inset-inline-end: var(--app-shell-aside-offset, 0rem);
	}

	:where([data-with-border]) > & {
		border-top: 1px solid var(--app-shell-border-color);
	}
}
</style>
