<script lang="ts">
import type { AlignedPlacement, Side } from '@floating-ui/vue'


export interface MenuSubProps {
	/** Dropdown position relative to the target element @default 'right-start' */
	placement?: Side | AlignedPlacement

	/** Offset of the dropdown element @default 0 */
	offset?: number

	/** Open delay in ms for hover @default 0 */
	openDelay?: number

	/** Close delay in ms for hover @default 100 */
	closeDelay?: number
}

import type { Ref, ShallowRef } from 'vue'

import { createStrictInjection } from '@nui/composables'


export interface SubMenuState {
	/** Submenu open state */
	opened: Ref<boolean>
	/** Open the submenu */
	open: () => void
	/** Close the submenu */
	close: () => void
	/** Focus the first item of the submenu dropdown */
	focusFirstItem: () => void
	/** Focus the target that opens this submenu */
	focusParentItem: () => void
	/** Parent submenu state, if this submenu is nested */
	parentContext: SubMenuState | null
	/** Register a child submenu close handler, closing any previously open sibling */
	registerOpenSub: (closeFn: () => void) => () => void
	/** Base id used to build target/dropdown element ids */
	id: string
	/** Bound to the submenu target element */
	targetRef: ShallowRef<HTMLElement | null>
}

const [provideSubMenuState, injectSubMenuState] = createStrictInjection(
	(state: SubMenuState) => state,
	{ injectionKey: Symbol('nuance-sub-menu'), name: 'MenuSub' },
)


export const useSubMenuState = injectSubMenuState
</script>

<script lang="ts" setup>
import { useTimeoutFn } from '@vueuse/core'
import { ref, shallowRef, useId, watch } from 'vue'

import Popover from '../../popover/popover.vue'
import { useMenuState } from '../menu.vue'


const {
	placement = 'right-start',
	offset = 0,
	openDelay = 0,
	closeDelay = 100,
} = defineProps<MenuSubProps>()

const opened = defineModel<boolean>('open', { default: false })

const id = useId()

const menu = useMenuState()
const parentContext = useSubMenuState()

const targetRef = shallowRef<HTMLElement | null>(null)

function open() {
	opened.value = true
}
function close() {
	opened.value = false
}

// ─── Delayed Hover ───
const {
	start: scheduleOpen,
	stop: cancelOpen,
} = useTimeoutFn(open, () => openDelay, { immediate: false })
const {
	start: scheduleClose,
	stop: cancelClose,
} = useTimeoutFn(close, () => closeDelay, { immediate: false })

function openWithDelay() {
	cancelClose()
	cancelOpen()
	scheduleOpen()
}
function closeWithDelay() {
	cancelOpen()
	cancelClose()
	scheduleClose()
}

// ─── Sibling Registration ───
// Registering with the parent menu/submenu closes any previously open sibling
// when this submenu opens.
const register = parentContext?.registerOpenSub ?? menu.registerOpenSub
let unregister: (() => void) | null = null
watch(opened, isOpen => {
	if (isOpen) {
		unregister = register(close)
	}
	else {
		unregister?.()
		unregister = null
	}
})

// ─── Child Registration ───
// Single-slot registry for this submenu's direct children, so opening one child
// submenu closes any sibling child. Mirrors the menu-root `registerOpenSub`.
const activeChildClose = ref<(() => void) | null>(null)
function registerOpenSub(closeFn: () => void): () => void {
	if (activeChildClose.value && activeChildClose.value !== closeFn)
		activeChildClose.value()
	activeChildClose.value = closeFn
	return () => {
		if (activeChildClose.value === closeFn)
			activeChildClose.value = null
	}
}

// ─── Focus Management ───
function focusFirstItem() {
	setTimeout(() => {
		document
			.getElementById(`${id}-dropdown`)
			?.querySelector<HTMLElement>('[data-menu-item]:not([data-disabled])')
			?.focus()
	}, 16)
}
function focusParentItem() {
	document.getElementById(`${id}-target`)?.focus()
}

provideSubMenuState({
	opened,
	open: openWithDelay,
	close: closeWithDelay,
	focusFirstItem,
	focusParentItem,
	parentContext,
	registerOpenSub,
	id,
	targetRef,
})
</script>

<template>
	<Popover
		v-model:open='opened'
		:placement
		:offset
		:with-arrow='false'
	>
		<slot />
	</Popover>
</template>
