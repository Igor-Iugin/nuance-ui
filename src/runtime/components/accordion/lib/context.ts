import type { Classes } from '@nui/types'
import type { ComputedRef, Ref } from 'vue'

import { createStrictInjection } from '@nui/composables'


export type AccordionVariant = 'default' | 'contained' | 'filled' | 'separated'

export type AccordionChevronPosition = 'left' | 'right'

export type AccordionClasses = Classes<
	| 'root'
	| 'item'
	| 'header'
	| 'control'
	| 'label'
	| 'icon'
	| 'chevron'
	| 'panel'
	| 'content'
>

export interface AccordionRootContext {
	/** User-provided class names per styles-API part */
	classes: Ref<AccordionClasses | undefined>
	/** Whether the item with the given value is currently open */
	isItemActive: (value: string) => boolean
	/** Toggle the item with the given value */
	toggleItem: (value: string) => void
	/** Build the accessible id for an item header */
	getHeaderId: (value: string) => string
	/** Build the accessible id for an item panel */
	getPanelId: (value: string) => string

	disabled: Ref<boolean | undefined>
	variant: Ref<AccordionVariant>
	transitionDuration: Ref<number>
	disableChevronRotation: Ref<boolean | undefined>
	chevronPosition: Ref<AccordionChevronPosition>
	chevron: Ref<string | undefined>
	order: Ref<'1' | '2' | '3' | '4' | '5' | '6' | undefined>
	loop: Ref<boolean>
	keepMounted: Ref<boolean>
}

export interface AccordionItemContext {
	value: ComputedRef<string>
	open: ComputedRef<boolean>
	disabled: ComputedRef<boolean | undefined>
	dataState: ComputedRef<'open' | 'closed'>
	dataDisabled: ComputedRef<'' | undefined>
}

export const [provideAccordionRootState, useAccordionRootState] = createStrictInjection(
	(state: AccordionRootContext) => state,
	{ name: 'AccordionRoot', injectionKey: Symbol('accordion-root') },
)

export const [provideAccordionItemState, useAccordionItemState] = createStrictInjection(
	(state: AccordionItemContext) => state,
	{ name: 'AccordionItem', injectionKey: Symbol('accordion-item') },
)
