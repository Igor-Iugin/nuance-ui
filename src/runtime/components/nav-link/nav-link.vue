<script setup lang='ts'>
import type { NuanceColor, NuanceSpacing } from '@nui/types'
import type { NuxtLinkProps } from 'nuxt/app'

import { useStyleResolver } from '@nui/composals'
import { createVariantColorResolver, getSize } from '@nui/utils'
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

	/** Spacing between left/right section and content */
	spacing?: NuanceSpacing

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
		spacing,
	},
} = pickLinkProps(props)

const style = computed(() => useStyleResolver(theme => {
	const { background, hover, text } = createVariantColorResolver({ variant, color, theme })
	return {
		'--nl-bg': variant ? background : undefined,
		'--nl-hover': variant ? hover : undefined,
		'--nl-color': variant ? text : undefined,
		'--nl-spacing': getSize(spacing, 'nl-spacing'),
	}
}))
</script>

<template>
	<NuxtLink v-slot='{ href, navigate, isActive, ...linkProps }' v-bind='link' custom>
		<UnstyledButton
			is='a'
			:href
			:style
			:class='$style.root'
			:mod='[{ active: isActive, disabled }, mod]'
			:aria-current="isActive ? 'page' : undefined"
			:rel='("rel" in linkProps) ? linkProps?.rel : undefined'
			:target='("target" in linkProps) ? linkProps?.target : undefined'
			@click='navigate'
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
	--nl-spacing-xs: .25rem;
	--nl-spacing-sm: .5rem;
	--nl-spacing-md: .75rem;
	--nl-spacing-lg: 1rem;
	--nl-spacing-xl: 1.25rem;

	--nl-bg: var(--color-primary-light);
	--nl-hover: var(--color-primary-light-hover);
	--nl-color: var(--color-primary-light-color);
	--nl-spacing: var(--nl-spacing-xs);

	user-select: none;

	display: flex;
	gap: var(--nl-spacing);
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

	&>svg {
		display: block;
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

	font-size: var(--font-size-xs);
	color: var(--description-color, var(--color-dimmed));
	text-overflow: ellipsis;

	opacity: var(--description-opacity, 1);

	:where([data-no-wrap]) & {
		white-space: nowrap;
	}
}
</style>
