<script setup lang='ts'>
import type { UiKitSize } from '@nui/types'

import { getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from './box.vue'

import NBox from './box.vue'


export interface ContainerProps extends BoxProps {
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
	<NBox
		:is
		:style
		:mod='_mod'
		:class='$style.root'
	>
		<slot />
	</NBox>
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
