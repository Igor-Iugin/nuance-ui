<script setup lang='ts'>
import type { UiKitSize } from '@nui/types'

import { getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from './box.vue'

import Box from './box.vue'


export interface ContainerProps extends /* @vue-ignore */ BoxProps {
	size?: UiKitSize | string | number
	fluid?: boolean
}

const {
	is,
	mod,
	fluid,
	size,
} = defineProps<ContainerProps>()

const style = computed(() => ({
	'--container-size': fluid ? undefined : getSize(size, 'container-size'),
}))

const _mod = computed(() => [{ fluid }, mod])
</script>

<template>
	<Box
		:is
		:style
		:mod='_mod'
		:class='$style.root'
	>
		<slot />
	</Box>
</template>

<style module>
.root {
	--container-size-xs: var(--breakpoint-xs);
	--container-size-sm: var(--breakpoint-sm);
	--container-size-md: var(--breakpoint-md);
	--container-size-lg: var(--breakpoint-lg);
	--container-size-xl: var(--breakpoint-xl);
	--container-size: var(--container-size-md);

	max-width: var(--container-size);
	margin-inline: auto;
	padding-inline: var(--spacing-md);

	&:where([data-fluid]) {
		max-width: 100%;
	}
}
</style>
