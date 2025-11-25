<script setup lang='ts'>
import type { UiKitColor } from '@types'
import type { NuxtLinkProps } from 'nuxt/app'

import { useActiveLink, useStyleResolver } from '@composals'
import { createVariantColorResolver } from '@utils'
import { computed } from 'vue'

import type { BoxProps } from '../box.vue'

import NBox from '../box.vue'
import { UnstyledButton } from '../button'
import { extractNuxtLinkProps } from '../link'


export interface NavLinkProps extends BoxProps, Omit<NuxtLinkProps, 'href' | 'custom'> {
	/** Link description, displayed below the label */
	description?: string

	/** Determines whether the link should have active styles @default `false` */
	active?: boolean

	/** Key of `theme.colors` of any valid CSS color to control active styles @default `theme.primaryColor` */
	color?: UiKitColor

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
		mod: _mod,
		variant = 'filled',
		color,
		noWrap,
		description,
	},
} = extractNuxtLinkProps(props)

const active = useActiveLink(link?.to)
const mod = computed(() => [{ active: active.value, disabled }, _mod])

const style = useStyleResolver(theme => {
	const { background, hover, text } = createVariantColorResolver({ variant, color, theme })
	return {
		root: {
			'--nl-bg': variant ? background : undefined,
			'--nl-hover': variant ? hover : undefined,
			'--nl-color': variant ? text : undefined,
		},
	}
})
</script>

<template>
	<!-- @vue-ignore	-->
	<NuxtLink
		v-slot='{ href, navigate }'
		v-bind='link'
		custom
	>
		<UnstyledButton
			is='a'
			:class='$style.root'
			:style='style.root'
			:mod
			:href
			@click='(e: MouseEvent) => navigate(e)'
		>
			<span
				v-if='$slots.leftSection'
				:class='$style.section'
				data-position='left'
			>
				<slot name='leftSection' />
			</span>

			<NBox :class='$style.body' :mod='{ "no-wrap": noWrap }'>
				<span :class='$style.label'>
					<slot />
				</span>
				<NBox :class='$style.description' :mod='{ active }'>
					<slot name='description'>
						{{ description }}
					</slot>
				</NBox>
			</NBox>

			<span
				v-if='$slots.rightSection'
				:class='$style.section'
				data-position='right'
			>
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

	&:where([data-active], [aria-current='page']) {
		color: var(--nl-color);

		background-color: var(--nl-bg);

		.description {
			--description-opacity: 0.9;
			--description-color: var(--nl-color);
		}

		@mixin hover {
			background-color: var(--nl-hover);
		}
	}

	@mixin hover {
		@mixin where-light {
			background-color: var(--color-gray-0);
		}

		@mixin where-dark {
			background-color: var(--color-dark-6);
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
