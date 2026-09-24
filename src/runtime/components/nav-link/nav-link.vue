<script setup lang='ts'>
import type { ButtonProps } from '../button'

import Box from '../box/box.vue'
import Button from '../button/button.vue'


export type NavLinkVariant = 'filled' | 'light' | 'subtle' | 'outline'

export interface NavLinkProps extends Omit<ButtonProps, 'active' | 'label' | 'variant'> {
	/** Link description displayed below the label */
	description?: string

	/** Active state */
	active?: boolean

	/** Disables the component */
	disabled?: boolean

	/** Prevents label and description from wrapping */
	noWrap?: boolean

	/** Visual variant applied when active @default 'filled' */
	variant?: NavLinkVariant
}

const {
	active,
	noWrap,
	description,
	mod,
	variant = 'default',
	activeVariant,
	color,
	activeColor,
	size = 'sm',
	radius,
	...rest
} = defineProps<NavLinkProps>()
</script>

<template>
	<Button
		v-bind='rest'
		:size
		:radius
		:active
		:variant
		:active-variant
		:color
		:active-color
		active-mode='current'
		:classes='{ root: $style.root, label: $style.label }'
		:mod='[{ "no-wrap": noWrap }, mod]'
	>
		<template v-if='$slots.leftSection' #leftSection>
			<slot name='leftSection' />
		</template>

		<slot />

		<Box :class='$style.description'>
			<slot name='description'>
				{{ description }}
			</slot>
		</Box>

		<template v-if='$slots.rightSection' #rightSection>
			<slot name='rightSection' />
		</template>
	</Button>
</template>

<style module>
.root {
	width: 100%;

	height: calc(var(--button-height) + .25rem);

	&:where([data-active]) .description {
		--description-opacity: 0.8;
	}

	&:where([data-variant='filled']) {
		--description-color: var(--color-body);
	}
}

.label {
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;

	font-size: var(--font-size-md);

	font-weight: 600;

	text-align: left;

	text-overflow: ellipsis;
	white-space: normal;

	:where([data-no-wrap]) & {
		white-space: nowrap;
	}
}

.description {
	overflow: hidden;

	margin-top: .2em;

	font-size: var(--font-size-2sm);
	color: var(--description-color, var(--color-dimmed));
	text-overflow: ellipsis;

	opacity: var(--description-opacity, 1);

	:where([data-no-wrap]) & {
		white-space: nowrap;
	}
}
</style>
