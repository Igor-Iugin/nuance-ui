<script setup lang='ts'>
import { getRadius, getShadow } from '@nui/utils'
import { computed } from 'vue'

import { usePopoverState } from './lib/context'


const {
	id,
	onToggle,
	store: { floatingStyles, arrowStyles, arrowRef, dropdownRef },
	withArrow,
	radius,
	shadow,
} = usePopoverState()

const style = computed(() => ({
	'--popover-radius': radius ? getRadius(radius) : undefined,
	'--popover-shadow': getShadow(shadow),
}))
</script>

<template>
	<div
		:id='id'
		ref='dropdownRef'
		popover
		:style='{ ...floatingStyles, ...style }'
		:class='$style.dropdown'
		@toggle='onToggle'
	>
		<slot />
		<span
			v-if='withArrow'
			ref='arrowRef'
			:class='$style.arrow'
			:style='arrowStyles'
		/>
	</div>
</template>

<style module lang='postcss'>
.dropdown {
	--popover-radius: var(--radius-default);
	--popover-shadow: none;

	overflow: visible;

	padding: var(--spacing-xs) var(--spacing-sm);
	border: 1px solid var(--popover-border-color);
	border-radius: var(--popover-radius);

	color: var(--color-text);

	opacity: 0;
	box-shadow: var(--popover-shadow);

	transition: opacity 0.2s, overlay 0.2s allow-discrete, display 0.2s allow-discrete;


	&:popover-open {
		opacity: 1;

		@starting-style {
			opacity: 0;
		}
	}

	@mixin where-light {
		--popover-border-color: var(--color-gray-2);

		background-color: var(--color-white);
	}

	@mixin where-dark {
		--popover-border-color: var(--color-dark-4);

		background-color: var(--color-dark-6);
	}
}

.arrow {
	--arrow-size: 7px;
	--arrow-radius: 0px;
	--arrow-placement: calc(var(--arrow-size) / 2 * -1);

	position: absolute;
	transform: rotate(45deg);

	width: var(--arrow-size);
	height: var(--arrow-size);

	border: 1px solid var(--popover-border-color);

	background-color: inherit;
}
</style>
