<script lang="ts">
import type { Classes, NuanceRadius } from '@nui/types'

import type { TitleProps } from './title.vue'


export interface AccordionItem {
	label?: string
	slot?: string
	content?: string
	disabled?: boolean

	/** Iconify icon */
	icon?: string
	/** Iconify icon */
	trailingIcon?: string
	/**
   * A unique value for the accordion item. Defaults to the index.
   * Also used as the Vue `key` for this item, so providing a stable value prevents
   * accordion content (and its local state) from remounting when items are added, removed,
   * or reordered.
   */
	value?: string
}

type AccordionVariant = 'default' | 'contained' | 'filled' | 'separated'

interface AccordionVars {
	root:
		| '--accordion-transition-duration'
		| '--accordion-chevron-size'
		| '--accordion-radius'
}

export interface AccordionProps<Multiple extends boolean = false> {
	/** If set, multiple items can be opened at the same time @default false */
	multiple?: Multiple

	/** If set, arrow keys loop through items (first to last and last to first) @default true */
	loop?: boolean

	/** @default 'default' */
	variant?: AccordionVariant


	/** Transition duration in ms @default 200 */
	transitionDuration?: number

	/** If set, chevron rotation is disabled @default false */
	disableChevronRotation?: boolean

	/** Position of the chevron relative to the item label @default right */
	chevronPosition?: 'left' | 'right'

	/** Size of the chevron icon container @default auto */
	chevronSize?: number | string

	/**
	 * Size of the default chevron icon. Ignored when `chevron` prop is set.
	 * Use `chevronSize` instead when using custom chevron.
	 * @default 16
	 */
	chevronIconSize?: number | string

	/**
	 * Sets heading level (h2-h6) for `Accordion.Control` elements.
	 * Wraps each control in the corresponding heading tag, recommended to meet WAI-ARIA accessibility requirements.
	 * Has no visual effect.
	 */
	order?: TitleProps['order']

	/** Custom chevron icon */
	chevron?: string

	/**
	 * Key of `theme.radius` or any valid CSS value to set border-radius.
	 * Numbers are converted to rem.
	 *  @default theme.defaultRadius */
	radius?: NuanceRadius

	/**
	 *  If set to `false`, panels are unmounted when collapsed.
	 * By default, panels stay mounted when collapsed. @default true
	 */
	keepMounted?: boolean

	classes?: Classes<
		| 'root'
		| 'content'
		| 'item'
		| 'panel'
		| 'icon'
		| 'chevron'
		| 'label'
		| 'itemTitle'
		| 'control'
	>
}
</script>

<script setup lang='ts' generic='Multiple extends boolean = false'>
import { getRadius, getSize, useVarsResolver } from '#imports'

import Box from './box.vue'


const {
	transitionDuration,
	chevronSize,
	radius,
} = defineProps<AccordionProps<Multiple>>()

const style = useVarsResolver<AccordionVars>(() => ({
	root: {
		'--accordion-transition-duration':
        transitionDuration === undefined ? undefined : `${transitionDuration}ms`,
		'--accordion-chevron-size': chevronSize === undefined ? undefined : getSize(chevronSize),
		'--accordion-radius': radius === undefined ? undefined : getRadius(radius),
	},
}))
</script>

<template>
	<Box :style='style.root'>
		accordion
	</Box>
</template>

<style module>
.root {
	--accordion-radius: var(--radius-default);
}

.panel {
	overflow-wrap: break-word;
}

.content {
	padding: var(--spacing-md);
	padding-top: calc(var(--spacing-xs) / 2);
}

.itemTitle {
	width: 100%;
	margin: 0;
	padding: 0;
}

.control {
	cursor: pointer;

	display: flex;
	flex-direction: row-reverse;
	align-items: center;

	width: 100%;
	padding-inline: var(--spacing-md);

	color: var(--color-bright);

	opacity: 1;
	background-color: transparent;

	&:where([data-chevron-position='left']) {
		flex-direction: row;

		padding-inline-start: 0;
	}

	&:where(:disabled, [data-disabled]) {
		cursor: not-allowed;

		opacity: 0.4;
	}
}

.control--default,
.control--contained {
	&:where(:not(:disabled, [data-disabled])) {
		@mixin hover {
			@mixin where-light {
				background-color: var(--color-gray-0);
			}

			@mixin where-dark {
				background-color: var(--color-dark-6);
			}
		}
	}
}

.label {
	overflow: hidden;
	flex: 1;

	padding-top: var(--spacing-sm);
	padding-bottom: var(--spacing-sm);

	font-weight: var(--font-weight-regular);
	color: inherit;
	text-overflow: ellipsis;
}

.chevron {
	transform: rotate(0deg);

	display: flex;
	align-items: center;
	justify-content: flex-start;

	width: var(--accordion-chevron-size, rem(15px));
	min-width: var(--accordion-chevron-size, rem(15px));

	transition: transform var(--accordion-transition-duration, 200ms) ease;

	&:where([data-rotate]) {
		transform: rotate(180deg);
	}

	&:where([data-position='left']) {
		margin-inline-start: var(--spacing-md);
		margin-inline-end: var(--spacing-md);
	}
}

.icon {
	display: flex;
	align-items: center;
	justify-content: center;

	margin-inline-end: var(--spacing-sm);

	&:where([data-chevron-position='left']) {
		margin-inline-start: var(--spacing-lg);
		margin-inline-end: 0;
	}
}

.item {
	@mixin where-light {
		--item-border-color: var(--color-gray-3);
		--item-filled-color: var(--color-gray-0);
	}

	@mixin where-dark {
		--item-border-color: var(--color-dark-4);
		--item-filled-color: var(--color-dark-6);
	}
}

.item--default {
	border-bottom: 1px solid var(--item-border-color);
}

.item--contained {
	border: 1px solid var(--item-border-color);

	transition: background-color 150ms ease;

	&:where([data-active]) {
		background-color: var(--item-filled-color);
	}

	&:first-of-type {
		border-start-start-radius: var(--accordion-radius);
		border-start-end-radius: var(--accordion-radius);

		&>[data-accordion-control] {
			border-start-start-radius: var(--accordion-radius);
			border-start-end-radius: var(--accordion-radius);
		}
	}

	&:last-of-type {
		border-end-start-radius: var(--accordion-radius);
		border-end-end-radius: var(--accordion-radius);

		&>[data-accordion-control] {
			border-end-start-radius: var(--accordion-radius);
			border-end-end-radius: var(--accordion-radius);
		}
	}

	&+& {
		border-top: 0;
	}
}

.item--filled {
	border-radius: var(--accordion-radius);

	&:where([data-active]) {
		background-color: var(--item-filled-color);
	}
}

.item--separated {
	border: 1px solid transparent;
	border-radius: var(--accordion-radius);

	background-color: var(--item-filled-color);

	transition: background-color 150ms ease;

	&[data-active] {
		border-color: var(--item-border-color);

		@mixin where-light {
			background-color: var(--color-white);
		}

		@mixin where-dark {
			background-color: var(--color-dark-7);
		}
	}

	&+& {
		margin-top: var(--spacing-md);
	}
}
</style>
