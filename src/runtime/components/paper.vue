<script setup lang='ts'>
import type { NuanceRadius, NuanceShadow } from '@nui/types'

import { getRadius, getShadow } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from './box/box.vue'

import Box from './box/box.vue'


export interface PaperProps extends BoxProps {
	/** Shadow token */
	shadow?: NuanceShadow

	/** Border radius */
	radius?: NuanceRadius

	/** Adds a border */
	withBorder?: boolean
}

const {
	mod,
	radius,
	shadow,
	withBorder,
	...rest
} = defineProps<PaperProps>()
const style = computed(() => ({
	'--paper-radius': radius && getRadius(radius),
	'--paper-shadow': getShadow(shadow),
}))
</script>

<template>
	<Box
		v-bind='rest'
		:style
		:class='$style.root'
		:mod='[{ "with-border": withBorder }, mod]'
	>
		<slot />
	</Box>
</template>

<style module>
.root {
	--paper-radius: var(--radius-default);
	--paper-shadow: none;

	touch-action: manipulation;

	display: block;

	border-radius: var(--paper-radius);

	text-decoration: none;

	background-color: var(--color-body);

	outline: 0;
	box-shadow: var(--paper-shadow);
	-webkit-tap-highlight-color: transparent;

	&:where([data-with-border]) {
		border: rem(1px) solid var(--paper-border-color);
	}

	@mixin light {
		--paper-border-color: var(--color-gray-3);
	}

	@mixin dark {
		--paper-border-color: var(--color-dark-7);
	}
}
</style>
