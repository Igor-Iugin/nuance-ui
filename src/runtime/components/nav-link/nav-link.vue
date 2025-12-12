<script setup lang='ts'>
import type { NuanceColor } from '@nui/types'
import type { NuxtLinkProps } from 'nuxt/app'

import { useStyleResolver } from '@nui/composals'
import { createVariantColorResolver } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import UnstyledButton from '../button/unstyled-button.vue'
import { pickLinkProps } from '../link'


export interface NavLinkProps extends BoxProps, Omit<NuxtLinkProps, 'href' | 'custom'> {
	/** Link description, displayed below the label */
	description?: string

	/** Determines whether the link should have active styles @default `false` */
	active?: boolean

	/** Key of `theme.colors` of any valid CSS color to control active styles @default `theme.primaryColor` */
	color?: NuanceColor

	/** If set, label and description do not wrap to the next line @default `false` */
	noWrap?: boolean

	/** If set, disabled styles will be added to the root element @default `false` */
	disabled?: boolean

	variant?: 'filled' | 'light' | 'subtle'
}

const props = defineProps<NavLinkProps>()

const {
	link,
	rest: {
		disabled,
		mod,
		variant = 'filled',
		color,
		noWrap,
		description,
	},
} = pickLinkProps(props)

const style = computed(() => useStyleResolver(theme => {
	const { background, hover, text } = createVariantColorResolver({ variant, color, theme })
	return {
		'--nl-bg': variant ? background : undefined,
		'--nl-hover': variant ? hover : undefined,
		'--nl-color': variant ? text : undefined,
	}
}))
</script>

<template>
	<NuxtLink
		v-slot='{ href, navigate, isActive }'
		v-bind='link'
		custom
	>
		<UnstyledButton
			is='a'
			:style
			:class='$style.root'
			:mod='[{ active: isActive, disabled }, mod]'
			:href
			@click='(e: MouseEvent) => navigate(e)'
		>
			<span v-if='$slots.leftSection' :class='$style.section' data-position='left'>
				<slot name='leftSection' />
			</span>

			<Box :class='$style.body' :mod='{ "no-wrap": noWrap }'>
				<span :class='$style.label'>
					<slot />
				</span>
				<Box :class='$style.description' :mod='{ active }'>
					<slot name='description'>
						{{ description }}
					</slot>
				</Box>
			</Box>

			<span v-if='$slots.rightSection' :class='$style.section' data-position='right'>
				<slot name='rightSection' />
			</span>
		</UnstyledButton>
	</NuxtLink>
</template>

<style module lang='postcss'>
.root {
	--nl-bg: var(--color-primary-light);
	--nl-hover: var(--color-primary-light-hover);
	--nl-color: var(--color-primary-light-color);

	user-select: none;

	display: flex;
	align-items: center;

	width: 100%;
	padding: .25rem var(--spacing-sm);
	border-radius: var(--radius-default);

	&:where([data-disabled]) {
		pointer-events: none;

		opacity: 0.4;
	}

	&:hover {
		@mixin where-light {
			background-color: var(--color-gray-0);
		}

		@mixin where-dark {
			background-color: var(--color-dark-6);
		}
	}

	&:where([data-active]) {
		color: var(--nl-color);

		background-color: var(--nl-bg);

		.description {
			--description-opacity: 0.9;
			--description-color: var(--nl-color);
		}

		&:hover {
			background-color: var(--nl-hover);
		}
	}
}

.section {
	display: flex;
	align-items: center;
	justify-content: center;

	transition: transform 150ms ease;

	& > svg {
		display: block;
	}

	&:where([data-position='left']) {
		margin-inline-end: var(--spacing-sm);
	}

	&:where([data-position='right']) {
		margin-inline-start: var(--spacing-sm);
	}

	&:where([data-rotate]) {
		transform: rotate(90deg);
	}
}

.label {
	font-size: var(--font-size-sm);
}

.body {
	overflow: hidden;
	flex: 1;

	text-overflow: ellipsis;

	&:where([data-no-wrap]) {
		white-space: nowrap;
	}
}

.description {
	overflow: hidden;
	display: block;

	font-size: var(--font-size-xs);
	color: var(--description-color, var(--color-dimmed));
	text-overflow: ellipsis;

	opacity: var(--description-opacity, 1);

	:where([data-no-wrap]) & {
		white-space: nowrap;
	}
}
</style>
