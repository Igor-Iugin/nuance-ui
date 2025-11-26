<script setup lang='ts'>
import type { UiKitRadius } from '@nui/types'

import { getRadius } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from './box.vue'

import Box from './box.vue'


export interface BackgroundImageProps extends /* @vue-ignore */ BoxProps {
	radius?: UiKitRadius | string
	/** Image url */
	src: string
}

const { radius, src, ...rest } = defineProps<BackgroundImageProps>()

const style = computed(() => ({
	'--bi-radius': radius ? getRadius(radius) : undefined,
	'backgroundImage': `url(${src})`,
}))
</script>

<template>
	<Box :style :class='$style.root' v-bind='rest' />
</template>

<style module lang='postcss'>
.root {
	--bi-radius: 0rem;

	position: absolute;
	inset: 0;

	display: block;

	width: 100%;
	border: 0;
	border-radius: var(--bi-radius, 0);

	text-decoration: none;

	background-position: center;
	background-size: cover;
}
</style>
