<script setup lang="ts">
import type { AnyString, NuanceSize } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getSize } from '@nui/utils'

import type { BoxProps } from './box/box.vue'

import Box from './box/box.vue'


export interface KbdVars {
	root: '--kbd-fz'
}

export interface KbdProps extends BoxProps {
	/**
	 * Controls `font-size` and `padding`
	 * @default `'sm'`
	 */
	size?: NuanceSize | AnyString
}

const { is = 'kbd', size, ...rest } = defineProps<KbdProps>()

const style = useVarsResolver<KbdVars>(() => ({
	root: { '--kbd-fz': getSize(size, 'kbd-fz') },
}))
</script>

<template>
	<Box
		:is
		v-bind='rest'
		:style='style.root'
		:class='$style.root'
	>
		<slot />
	</Box>
</template>

<style module>
.root {
	--kbd-fz-xs: 10px;
	--kbd-fz-sm: 12px;
	--kbd-fz-md: 14px;
	--kbd-fz-lg: 16px;
	--kbd-fz-xl: 20px;
	--kbd-fz: var(--kbd-fz-sm);

	unicode-bidi: embed;

	padding: 0.12em 0.45em;
	border: 1px solid;
	border-bottom-width: 3px;
	border-radius: var(--radius-sm);

	font-family: var(--font-family-monospace);
	font-size: var(--kbd-fz);
	font-weight: var(--font-weight-bold);
	line-height: var(--line-height);
	text-align: center;

	@mixin where-light {
		border-color: var(--color-gray-3);

		color: var(--color-gray-7);

		background-color: var(--color-gray-0);
	}

	@mixin where-dark {
		border-color: var(--color-dark-4);

		color: var(--color-dark-0);

		background-color: var(--color-dark-6);
	}
}
</style>
