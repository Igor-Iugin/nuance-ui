<script lang="ts">
import type { AnyString, NuanceRadius } from '@nui/types'

import { useVarsResolver } from '#imports'

import type { TitleProps } from '../title.vue'
import type { AccordionChevronPosition, AccordionClasses, AccordionVariant } from './lib/context'


interface AccordionVars {
	root:
		| '--accordion-transition-duration'
		| '--accordion-chevron-size'
		| '--accordion-radius'
}

export interface AccordionProps<Multiple extends boolean = false> extends BoxProps {
	/** If set, multiple items can be opened at the same time @default false */
	multiple?: Multiple

	/** Uncontrolled default open value(s) */
	defaultValue?: Multiple extends true ? string[] : string | null

	/** If set, arrow keys loop through item headers @default true */
	loop?: boolean

	/** Visual variant @default 'default' */
	variant?: AccordionVariant

	/** Transition duration in ms @default 200 */
	transitionDuration?: number

	/** If set, chevron rotation is disabled @default false */
	disableChevronRotation?: boolean

	/** Position of the chevron relative to the item label @default 'right' */
	chevronPosition?: AccordionChevronPosition

	/** Size of the chevron icon container @default auto */
	chevronSize?: number | string

	/** Custom chevron icon name */
	chevron?: string

	/** Disables the component */
	disabled?: boolean

	/**
	 * Sets heading level (h1-h6) for item headers, wrapping each in the matching heading tag.
	 * Recommended to meet WAI-ARIA requirements. Has no visual effect.
	 */
	order?: TitleProps['order']

	/** Border radius @default theme.defaultRadius */
	radius?: NuanceRadius | AnyString

	/** If `false`, panels are unmounted when collapsed @default true */
	keepMounted?: boolean

	/** Styles API */
	classes?: AccordionClasses
}

export type AccordionValue<Multiple extends boolean> = Multiple extends true ? string[] : string | null
</script>

<script setup lang='ts' generic='Multiple extends boolean = false'>
import { getRadius, getSize } from '@nui/utils'
import { toRefs, useId } from 'vue'

import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './accordion.module.css'
import { provideAccordionRootState } from './lib/context'


const {
	mod,
	loop = true,
	variant = 'default',
	transitionDuration = 200,
	disableChevronRotation,
	chevronPosition = 'right',
	chevronSize,
	chevron,
	disabled,
	order,
	radius,
	keepMounted = true,
	classes,
	...rest
} = defineProps<AccordionProps<Multiple>>()

const value = defineModel<AccordionValue<Multiple>>({
	default: p => (p.multiple ? [] : null) as AccordionValue<Multiple>,
})

const uid = useId()

function isItemActive(itemValue: string): boolean {
	return Array.isArray(value.value)
		? value.value.includes(itemValue)
		: value.value === itemValue
}

function toggleItem(itemValue: string) {
	if (Array.isArray(value.value)) {
		value.value = (value.value.includes(itemValue)
			? value.value.filter(v => v !== itemValue)
			: [...value.value, itemValue]) as AccordionValue<Multiple>
	}
	else {
		value.value = (value.value === itemValue ? null : itemValue) as AccordionValue<Multiple>
	}
}

const state = toRefs({
	classes,
	disabled,
	variant,
	transitionDuration,
	disableChevronRotation,
	chevronPosition,
	chevron,
	order,
	loop,
	keepMounted,
})

provideAccordionRootState({
	isItemActive,
	toggleItem,
	getHeaderId: v => `${uid}-header-${v}`,
	getPanelId: v => `${uid}-panel-${v}`,
	...state,
})

const style = useVarsResolver<AccordionVars>(() => ({
	root: {
		'--accordion-transition-duration': `${transitionDuration}ms`,
		'--accordion-chevron-size': chevronSize === undefined ? undefined : getSize(chevronSize),
		'--accordion-radius': radius === undefined ? undefined : getRadius(radius),
	},
}))
</script>

<template>
	<Box
		:id='uid'
		:style='style.root'
		:mod='[{ variant }, mod]'
		:class='[css.root, classes?.root]'
		v-bind='rest'
	>
		<slot />
	</Box>
</template>
