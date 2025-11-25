<script setup lang='ts'>
import type { BoxProps } from '../box.vue'
import Box from '../box.vue'


const { mod } = defineProps<BoxProps>()
</script>

<template>
	<Box is='nav' :mod :class='$style.root'>
		<slot/>
	</Box>
</template>

<style module lang='postcss'>
.root {
	position: fixed;

	z-index: 1;
	top: var(--app-shell-header-offset, 0rem);
	inset-inline-start: 0;
	transform: var(--app-shell-navbar-transform);

	display: flex;
	flex-direction: column;

	width: var(--app-shell-navbar-width);
	height: calc(100dvh - var(--app-shell-header-offset, 0rem) - var(--app-shell-footer-offset, 0rem));
	padding-block: var(--app-shell-element-padding);

	background-color: var(--color-aside);

	transition-timing-function: var(--app-shell-transition-timing-function);
	transition-duration: var(--app-shell-transition-duration);
	transition-property: transform, top, height;

	:where([data-layout='alt']) > & {
		top: 0;

		height: 100dvh;
	}

	:where([data-with-border]) > & {
		border-inline-end: 1px solid var(--app-shell-border-color);
	}
}
</style>
