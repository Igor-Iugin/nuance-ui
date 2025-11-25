<script setup lang='ts'>
import type { UiKitRadius, UiKitShadow } from '@types'

import { getRadius, getShadow } from '@utils'
import { computed } from 'vue'

import type { BoxProps } from './box.vue'
import NBox from './box.vue'


export interface PaperProps extends BoxProps {
	shadow?: UiKitShadow
	radius?: UiKitRadius
	withBorder?: boolean
}

const { is, mod, radius, shadow, withBorder } = defineProps<PaperProps>()
const style = computed(() => ({
	'--paper-radius': radius && getRadius(radius),
	'--paper-shadow': getShadow(shadow),
}))
</script>

<template>
	<NBox :is :style :class='$style.root' :mod='[mod, { "with-border": withBorder }]'>
		<slot/>
	</NBox>
</template>

<style module lang='postcss'>
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
		--paper-border-color: var(--color-slate-7);
	}
}
</style>
