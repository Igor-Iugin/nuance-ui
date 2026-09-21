<script setup lang='ts'>
import type { LinkButtonProps } from '../link/link-button.vue'

import Box from '../box/box.vue'
import LinkButton from '../link/link-button.vue'


export type NavLinkVariant = 'filled' | 'light' | 'subtle' | 'outline'

export interface NavLinkProps extends Omit<LinkButtonProps, 'active' | 'label' | 'variant'> {
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
	variant = 'filled',
	color,
	size = 'sm',
	radius = 'xs',
	...rest
} = defineProps<NavLinkProps>()
</script>

<template>
	<LinkButton
		v-bind='rest'
		:size
		:radius
		variant='subtle'
		:active-variant='variant'
		:active-color='color'
		:active
		active-mode='current'
		:classes='{ root: $style.root, label: $style.label }'
		:mod='[{ "no-wrap": noWrap }, mod]'
	>
		<template v-if='$slots.leftSection' #leftSection>
			<slot name='leftSection' />
		</template>

		<span :class='$style.title'>
			<slot />
		</span>
		<Box :class='$style.description'>
			<slot name='description'>
				{{ description }}
			</slot>
		</Box>

		<template v-if='$slots.rightSection' #rightSection>
			<slot name='rightSection' />
		</template>
	</LinkButton>
</template>

<style module>
.root {
	width: 100%;

	&:where([data-active]) .description {
		--description-opacity: 0.9;
	}

	&:where(&[data-variant='outline']) {
		border: 2px solid transparent;
		border-left: var(--button-bd);
		border-left-width: rem(2px);
	}
}

.label {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;

	font-size: var(--font-size-md);

	text-align: left;
	text-decoration: none;
	white-space: normal;
}

.title {
	overflow: hidden;

	text-overflow: ellipsis;

	:where([data-no-wrap]) & {
		white-space: nowrap;
	}
}

.description {
	overflow: hidden;

	font-size: var(--font-size-2sm);
	color: var(--description-color, var(--color-dimmed));
	text-overflow: ellipsis;

	opacity: var(--description-opacity, 1);

	:where([data-no-wrap]) & {
		white-space: nowrap;
	}
}
</style>
