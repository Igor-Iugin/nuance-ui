<script lang='ts'>
import type { AnyString, Classes, NuanceColor, NuanceRadius, NuanceSpacing } from '@nui/types'
import type { NuxtLinkProps } from 'nuxt/app'

import type { BoxProps } from '../box/box.vue'


export type NavLinkClasses = 'root' | 'section' | 'body' | 'label' | 'description' | 'collapse' | 'children'

export type NavLinkVariant = 'filled' | 'light' | 'subtle'

interface NavLinkVars {
	root: '--nl-bg' | '--nl-hover' | '--nl-color' | '--nl-radius'
	children: '--nl-offset'
}

export interface NavLinkProps extends BoxProps, Omit<NuxtLinkProps, 'href' | 'custom'> {
	/** Icon displayed before the label */
	icon?: string

	/** Icon displayed before the label */
	trailingIcon?: string

	/** Main link label */
	label?: string

	/** Link description displayed below the label */
	description?: string

	/** Active state */
	active?: boolean

	/** Color from theme @default 'primary' */
	color?: NuanceColor

	/** Visual variant applied when active @default 'light' */
	variant?: NavLinkVariant

	/** Border radius */
	radius?: NuanceRadius | AnyString

	/** Truncates label and description with ellipsis instead of wrapping */
	noWrap?: boolean

	/** Disables the component */
	disabled?: boolean

	/** Indentation of nested links @default 'lg' */
	childrenOffset?: NuanceSpacing | AnyString

	/** Prevents the right section from rotating when expanded */
	disableRightSectionRotation?: boolean

	/** Keeps nested links mounted when collapsed @default true */
	keepMounted?: boolean

	/** Styles API */
	classes?: Classes<NavLinkClasses>

	onClick?: ((event: MouseEvent) => void) | Array<((event: MouseEvent) => void)>
}

export interface NavLinkSlots {
	/** Link label, replaces the `label` prop */
	default: []
	/** Description below the label, replaces the `description` prop */
	description: []
	/** Content before the label */
	leftSection: []
	/** Content after the label, replaces the chevron */
	rightSection: [props: { opened: boolean }]
	/** Nested links, rendered inside a collapsible area */
	children: [props: { opened: boolean }]
}
</script>

<script setup lang='ts'>
import { useConfig, useVarsResolver } from '@nui/composables'
import { getRadius, getSpacing } from '@nui/utils'
import { computed, useSlots } from 'vue'

import Box from '../box/box.vue'
import UnstyledButton from '../button/unstyled-button.vue'
import Collapse from '../collapse.vue'
import { pickLinkProps } from '../link/lib'


defineOptions({ inheritAttrs: false })

const {
	label,
	description,
	active,
	color,
	variant = 'filled',
	radius,
	noWrap,
	disabled,
	childrenOffset = 'lg',
	disableRightSectionRotation,
	keepMounted = true,
	classes,
	mod,
	onClick,
	icon,
	trailingIcon,
	...props
} = defineProps<NavLinkProps>()

defineSlots<NavLinkSlots>()

const opened = defineModel<boolean>('opened', { default: false })

const slots = useSlots()
const { icons, variantResolver } = useConfig()

const withChildren = computed(() => !!slots.children)
const { link, rest } = pickLinkProps(props)

const style = useVarsResolver<NavLinkVars>(theme => {
	const { background, hover, text } = variantResolver({
		theme,
		variant,
		color,
	})

	return {
		root: {
			'--nl-bg': background,
			'--nl-hover': hover,
			'--nl-color': text,
			'--nl-radius': getRadius(radius),
		},
		children: {
			'--nl-offset': getSpacing(childrenOffset),
		},
	}
})

function handleClick(event: MouseEvent, navigate?: (event: MouseEvent) => void) {
	if (disabled) {
		event.preventDefault()
		event.stopPropagation()
		return
	}

	const handlers = Array.isArray(onClick) ? onClick : onClick ? [onClick] : []
	for (const handler of handlers)
		handler(event)

	// Links with nested items act as a disclosure trigger, not as navigation
	if (withChildren.value) {
		event.preventDefault()
		opened.value = !opened.value
		return
	}

	if (navigate && !event.defaultPrevented)
		navigate(event)
}

function handleKeydown(event: KeyboardEvent) {
	if (!withChildren.value || disabled)
		return

	event.preventDefault()
	opened.value = !opened.value
}
</script>

<template>
	<NuxtLink
		v-slot='{ href, navigate, isActive, ...linkProps }'
		v-bind='link'
		custom
	>
		<UnstyledButton
			v-bind='{ ...rest, ...$attrs }'
			is='a'
			:href
			:rel='"rel" in linkProps ? linkProps.rel : undefined'
			:target='"target" in linkProps ? linkProps.target : undefined'
			:style='style.root'
			:class='[$style.root, classes?.root]'
			:mod='[{
				disabled,
				"active": active !== undefined ? active : isActive,
				"expanded": withChildren && opened,
				"no-wrap": noWrap,
			}, mod]'
			:aria-current='(active !== undefined ? active : isActive)
				? "page"
				: undefined'
			:aria-expanded='withChildren ? opened : undefined'
			:aria-disabled='disabled ? "true" : undefined'
			@click='handleClick($event, navigate)'
			@keydown.space='handleKeydown'
		>
			<Box
				is='span'
				v-if='!!$slots.leftSection || !!icon'
				:class='[$style.section, classes?.section]'
				:mod='{ position: "left" }'
			>
				<slot name='leftSection'>
					<Icon v-if='icon' :name='icon' />
				</slot>
			</Box>

			<Box
				:class='[$style.body, classes?.body]'
				:mod='{ "no-wrap": noWrap }'
			>
				<Box is='span' :class='[$style.label, classes?.label]'>
					<slot>
						{{ label }}
					</slot>
				</Box>

				<Box
					is='span'
					v-if='$slots.description || description'
					:class='[$style.description, classes?.description]'
				>
					<slot name='description'>
						{{ description }}
					</slot>
				</Box>
			</Box>

			<Box
				is='span'
				v-if='!!$slots.rightSection || !!trailingIcon || withChildren'
				:class='[$style.section, classes?.section]'
				:mod='{
					position: "right",
					rotate: withChildren && opened && !disableRightSectionRotation,
				}'
			>
				<slot name='rightSection' :opened='opened'>
					<Icon :name='trailingIcon ?? icons.chevronRight' />
				</slot>
			</Box>
		</UnstyledButton>
	</NuxtLink>

	<Collapse
		v-if='withChildren'
		v-model:open='opened'
		:keep-mounted
		:class='classes?.collapse'
		:classes='{ content: $style.children }'
		:style='style.children'
	>
		<slot name='children' :opened='opened' />
	</Collapse>
</template>

<style module>
.root {
	user-select: none;

	display: flex;
	align-items: center;

	width: 100%;

	padding: 8px var(--spacing-sm);
	border-radius: var(--nl-radius, 0);

	&:where(:hover) {
		@mixin where-light {
			background-color: var(--color-gray-0);
		}

		@mixin where-dark {
			background-color: var(--color-dark-6);
		}
	}

	&:where([data-disabled]) {
		pointer-events: none;

		opacity: 0.4;
	}

	&:where([data-active]) {
		color: var(--nl-color);

		background-color: var(--nl-bg);

		&:where(:hover) {
			background-color: var(--nl-hover);
		}

		.description {
			--description-opacity: 0.9;
			--description-color: var(--nl-color);
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

.body {
	overflow: hidden;
	flex: 1;

	text-overflow: ellipsis;

	&:where([data-no-wrap]) {
		white-space: nowrap;
	}
}

.label {
	font-weight: 600;
}

.description {
	overflow: hidden;
	display: block;

	font-size: var(--font-size-2sm);
	color: var(--description-color, var(--color-dimmed));
	text-overflow: ellipsis;

	opacity: var(--description-opacity, 1);

	:where([data-no-wrap]) & {
		white-space: nowrap;
	}
}

.children {
	padding-inline-start: var(--nl-offset, var(--spacing-lg));
}
</style>
