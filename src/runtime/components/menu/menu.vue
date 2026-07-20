<script lang="ts">
import type { ModelRef, Ref, ToRefs } from 'vue'

import { createStrictInjection } from '@nui/composables'
import { ref, toRef } from 'vue'

import type { Classes } from '../../types/styling'
import type { PopoverEmits, PopoverProps } from '../popover'


export interface MenuProps extends PopoverProps {
	/** Uncontrolled menu initial opened state */
	defaultOpened?: boolean

	/** If set, the Menu is closed when one of the items is clicked */
	closeOnItemClick?: boolean

	/** If set, arrow key presses wrap around from last item to first and vice versa */
	loop?: boolean

	/** If set, the dropdown is closed when the `Escape` key is pressed @default true */
	closeOnEscape?: boolean

	/**
	 * Event trigger to open menu.
	 *
	 * Note: 'hover' is not keyboard accessible
	 * prefer 'click-hover' for accessible hover menus
	 */
	trigger?: 'click' | 'hover' | 'click-hover'

	/** Open delay in ms, applicable only to `trigger="hover"` variant */
	openDelay?: number

	/** Close delay in ms, applicable only to `trigger="hover"` variant */
	closeDelay?: number

	/** If set, the dropdown is closed on outside clicks */
	closeOnClickOutside?: boolean

	/**
	 * Events that trigger outside click detection.
	 * Includes mousedown for desktop clicks, touchstart for mobile, and keydown for Escape key handling
	 * @default ['mousedown', 'touchstart', 'keydown']
	 */
	clickOutsideEvents?: string[]

	/** Id base to create accessibility connections */
	id?: string

	/**
	 * Set the `tabindex` on all menu items.
	 * Use `0` to allow Tab key navigation through menu items (required for navigation menus following WAI-ARIA disclosure pattern).
	 * @default -1
	 */
	menuItemTabIndex?: -1 | 0

	/**
	 * Adds a hidden focusable element at the start of the dropdown to prevent unexpected focus jumps when opening with keyboard.
	 * Set to false if you need custom focus management.
	 * @default true
	 */
	withInitialFocusPlaceholder?: boolean

	/**
	 * Determines whether focus should be automatically returned to control when dropdown closes
	 * @default `true`
	 */
	returnFocus?: boolean

	/**
	 * Controls how indicator slot space is reserved on menu items for label alignment.
	 * - `'all'` reserves space on every `MenuItem`
	 * - `'with-indicators'` reserves space only on `MenuCheckboxItem` and `MenuRadioItem`
	 * - `'none'` reserves space only on items that currently display an indicator
	 * @default 'with-indicators'
	 */
	alignItemsLabels?: 'all' | 'with-indicators' | 'none'

	/**
	 * Custom icon rendered as the indicator of checked `MenuCheckboxItem` and selected `MenuRadioItem`.
	 * Can be overridden per item with the `checkIcon` prop.
	 */
	checkIcon?: string

	classes?: Classes<
		| 'item'
		| 'itemLabel'
		| 'itemSection'
		| 'itemIndicator'
		| 'label'
		| 'divider'
		| 'chevron'
		| 'search'
	>
}

export interface MenuState extends ToRefs<Required<Pick<
	MenuProps,
	| 'closeOnItemClick'
	| 'loop'
	| 'trigger'
	| 'menuItemTabIndex'
	| 'withInitialFocusPlaceholder'
	| 'alignItemsLabels'
>>> {
	toggleDropdown: () => void
	closeDropdownImmediately: () => void
	closeDropdown: () => void
	openDropdown: () => void
	getItemIndex: (node: HTMLButtonElement) => number | null
	opened: ModelRef<boolean>
	openedViaClick: Ref<boolean>
	setOpenedViaClick: (value: boolean) => void
	registerOpenSub: (closeFn: () => void) => () => void
	hasSearch: Ref<boolean>
	registerSearch: () => () => void

	/** User-provided class names per styles-API part */
	classes: Ref<MenuProps['classes']>
	/** Custom indicator icon for checked/selected selectable items */
	checkIcon: Ref<string | undefined>
}

const injectionKey = Symbol('nuance-menu')
const [Provide, Inject] = createStrictInjection((s: MenuState) => s, {
	injectionKey,
	name: 'MenuState',
})

export const useMenuState = Inject
</script>

<script lang="ts" setup>
import Popover from '../popover/popover.vue'
import { useDelayedHover } from './lib/use-delayed-hover'


const {
	// Popover props
	placement = 'bottom',
	offset = 8,
	arrowSize,
	arrowRadius,
	arrowOffset = 5,
	arrowPosition = 'center',
	width = 'max-content',
	disabled,
	floatingStrategy = 'fixed',
	radius,
	shadow,
	withArrow = false,
	// Menu props
	openDelay = 0,
	closeDelay = 100,
	closeOnItemClick,
	loop,
	trigger = 'click',
	menuItemTabIndex = -1,
	withInitialFocusPlaceholder = true,
	alignItemsLabels = 'with-indicators',
	keepMounted,
	checkIcon,
	classes,
} = defineProps<MenuProps>()

const emit = defineEmits<PopoverEmits>()

const opened = defineModel<boolean>('open', { default: p => !!p.defaultOpened })
const openedViaClick = ref(false)

function close() {
	opened.value = false
	openedViaClick.value = false
	emit('close')
}
function open() {
	opened.value = true
	emit('open')
}
const toggle = () => opened.value ? close() : open()

const {
	open: openWithDelay,
	close: closeWithDelay,
} = useDelayedHover({ open, close, openDelay, closeDelay })

const openDropdown = trigger === 'click' ? open : openWithDelay
const closeDropdown = trigger === 'click' ? close : closeWithDelay

// ─── Sub Menu ───
const activeSubClose = ref<(() => void) | null>(null)
function registerOpenSub(closeFn: () => void) {
	if (activeSubClose.value && activeSubClose.value !== closeFn)
		activeSubClose.value()

	activeSubClose.value = closeFn

	return () => {
		if (activeSubClose.value === closeFn)
			activeSubClose.value = null
	}
}

// ─── Search ───
let searchCount = 0
const hasSearch = ref(false)
function registerSearch(): () => void {
	if (++searchCount === 1)
		hasSearch.value = true
	return () => {
		if (--searchCount === 0)
			hasSearch.value = false
	}
}

function getItemIndex(node: HTMLButtonElement): number | null {
	const dropdown = node.closest('[data-menu-dropdown]')
	if (!dropdown)
		return null

	const buttons = dropdown.querySelectorAll<HTMLButtonElement>('[data-menu-item]')
	const idx = Array.from(buttons).indexOf(node)
	return idx === -1 ? null : idx
}

Provide({
	closeOnItemClick: toRef(() => closeOnItemClick),
	loop: toRef(() => loop),
	trigger: toRef(() => trigger),
	menuItemTabIndex: toRef(() => menuItemTabIndex),
	withInitialFocusPlaceholder: toRef(() => withInitialFocusPlaceholder),
	alignItemsLabels: toRef(() => alignItemsLabels),
	classes: toRef(() => classes),
	checkIcon: toRef(() => checkIcon),
	toggleDropdown: toggle,
	closeDropdownImmediately: close,
	closeDropdown,
	openDropdown,
	getItemIndex,
	opened,
	openedViaClick,
	setOpenedViaClick: (v: boolean) => { openedViaClick.value = v },
	registerOpenSub,
	hasSearch,
	registerSearch,
})
</script>

<template>
	<Popover
		v-model:open='opened'
		:placement
		:offset
		:keep-mounted
		:width
		:with-arrow
		:arrow-size
		:arrow-offset
		:arrow-radius
		:arrow-position
		:radius
		:shadow
		:disabled
		:floating-strategy
		@open='$emit("open")'
		@close='$emit("close")'
	>
		<slot />
	</Popover>
</template>
