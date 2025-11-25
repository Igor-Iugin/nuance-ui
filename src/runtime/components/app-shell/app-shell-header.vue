<script setup lang='ts'>
import type { BoxProps } from '../box.vue'
import Box from '../box.vue'


const { mod } = defineProps<BoxProps>()
</script>

<template>
	<Box is='header' :mod :class='$style.root'>
		<slot/>
	</Box>
</template>

<style module lang='postcss'>
.root {
	position: fixed;
	z-index: 2;
	top: 0;
	inset-inline: 0;
	transform: var(--app-shell-header-transform);

	display: flex;

	height: var(--app-shell-header-height);
	padding-block: var(--app-shell-element-padding);
	padding-inline: 1rem;

	background-color: var(--color-header);

	transition-timing-function: var(--app-shell-transition-timing-function);
	transition-duration: var(--app-shell-transition-duration);
	transition-property: transform, left, right;

	:where([data-with-border]) > & {
		border-bottom: 1px solid var(--app-shell-border-color);
	}

	:where([data-layout='alt']) > & {
		inset-inline-start: var(--app-shell-navbar-offset, 0rem);
	}
}
</style>
