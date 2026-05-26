<script lang="ts" setup>
import type { ComponentPublicInstance, CSSProperties, HTMLAttributes } from 'vue'

import { useResizeObserver } from '@vueuse/core'
import { getSize, useVarsResolver } from '#imports'
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

import type { Classes } from '../types'
import type { BoxProps } from './box.vue'

import Box from './box.vue'


interface ScrollAreaVars {
	root: '--area-bar-size' | '--area-overscroll'
}

export interface ScrollAreaProps extends BoxProps {
	/**
	 * Allows content to drive the container width via `min-width: min-content` on the inner wrapper.
	 * Use when wrapping intrinsically-wide content (tables, code blocks) that must trigger horizontal
	 * overflow instead of shrinking to fit the viewport.
	 */
	autoSize?: boolean

	/**
	 * Scrollbar size, any valid CSS value for width/height, numbers are converted to rem
	 * @default '.75rem'
	 */
	scrollbarSize?: number | string

	/**
   * Defines scrollbars behavior. Native scrollbars are used, so `'always'` behaves like `'auto'`
   * (scrollbar appears only when content overflows — browser limitation).
   * - `'hover'` – scrollbars visible on hover (default)
   * - `'scroll'` – scrollbars visible during scrolling, hidden after `scrollHideDelay`
   * - `'auto'` – scrollbars visible only when content overflows
   * - `'never'` – scrollbars always hidden, content remains scrollable via mouse/touch
   * @default 'hover'
   * */
	type?: 'auto' | 'scroll' | 'hover' | 'never'

	/**
	 * Scroll hide delay in ms, applicable only when `type='scroll'`
	 * @default 1000
	 */
	scrollHideDelay?: number

	/**
   * Axis at which scrollbars must be rendered
   * - `'x'` - horizontal scrollbar only
   * - `'y'` - vertical scrollbar only
   * - `'xy'` - both scrollbars
   * - `false` - no scrollbars rendered, no overflow
   * @default 'y'
   */
	scrollbars?: 'x' | 'y' | 'xy' | false

	/**
   * Determines whether scrollbars should be offset with padding on given axis
   * - `true` - reserves space for both scrollbars (always)
   * - `'x'` - reserves space for horizontal scrollbar (always)
   * - `'y'` - reserves space for vertical scrollbar (always)
   * - `'present'` - reserves space only when scrollbars are visible via `scrollbar-gutter: stable`
   * @default false
   */
	offsetScrollbars?: boolean | 'x' | 'y' | 'present'

	/** Defines `overscroll-behavior` of the viewport. Composed per-axis according to `scrollbars` */
	overscrollBehavior?: CSSProperties['overscrollBehavior']

	/** Initial scroll position applied on mount before first paint to avoid flicker */
	startScrollPosition?: { x?: number, y?: number }

	/** Props forwarded to the viewport element */
	viewportProps?: HTMLAttributes

	classes?: Classes<'root' | 'viewport' | 'content'>
}

export interface ScrollAreaEmits {
	/** Fired once when the viewport reaches the bottom edge (0.8px tolerance) */
	bottom: []

	/** Fired once when the viewport reaches the top edge */
	top: []

	/** Fired once when the viewport reaches the left edge */
	left: []

	/** Fired once when the viewport reaches the right edge (0.8px tolerance) */
	right: []

	/** Current viewport scroll position, fired on every scroll */
	scrollPosition: [{ x: number, y: number }]

	/** Fired when overflow state of either axis changes */
	overflow: [{ x: boolean, y: boolean }]
}

const {
	is,
	mod,
	classes,
	scrollbars = 'y',
	type = 'hover',
	scrollbarSize,
	offsetScrollbars = false,
	overscrollBehavior,
	scrollHideDelay = 1000,
	startScrollPosition,
	viewportProps,
	autoSize,
} = defineProps<ScrollAreaProps>()

const emits = defineEmits<ScrollAreaEmits>()

const rootRef = useTemplateRef<ComponentPublicInstance>('rootRef')
const viewportRef = useTemplateRef<HTMLElement>('viewportRef')
const contentRef = useTemplateRef<HTMLElement>('contentRef')

const TOLERANCE = 0.8

type Edge = 'top' | 'bottom' | 'left' | 'right'

const atEdge: Record<Edge, boolean> = {
	top: false,
	bottom: false,
	left: false,
	right: false,
}

const overflowState = { x: false, y: false }

function emitEdge(name: Edge) {
	switch (name) {
		case 'top':
			return emits('top')
		case 'bottom':
			return emits('bottom')
		case 'left':
			return emits('left')
		case 'right':
			return emits('right')
	}
}

function checkEdge(name: Edge, reached: boolean) {
	if (reached && !atEdge[name]) {
		atEdge[name] = true
		emitEdge(name)
	}
	else if (!reached && atEdge[name]) {
		atEdge[name] = false
	}
}

function recomputeEdges() {
	const el = viewportRef.value
	if (!el)
		return

	const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el

	const overflowY = scrollHeight > clientHeight
	const overflowX = scrollWidth > clientWidth

	if (overflowX !== overflowState.x || overflowY !== overflowState.y) {
		overflowState.x = overflowX
		overflowState.y = overflowY
		emits('overflow', { x: overflowX, y: overflowY })
	}

	checkEdge('top', overflowY && scrollTop === 0)
	checkEdge('bottom', overflowY && scrollTop - (scrollHeight - clientHeight) >= -TOLERANCE)
	checkEdge('left', overflowX && scrollLeft === 0)
	checkEdge('right', overflowX && scrollLeft - (scrollWidth - clientWidth) >= -TOLERANCE)
}

const scrolling = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

function showScrollbar() {
	const el = viewportRef.value
	if (!el || type !== 'scroll')
		return

	if (!scrolling.value)
		scrolling.value = true

	if (hideTimer)
		clearTimeout(hideTimer)

	hideTimer = setTimeout(() => scrolling.value = false, scrollHideDelay)
}

onBeforeUnmount(() => {
	if (hideTimer)
		clearTimeout(hideTimer)
})

function onScroll(event: Event) {
	const el = event.currentTarget as HTMLElement
	showScrollbar()
	emits('scrollPosition', { x: el.scrollLeft, y: el.scrollTop })
	recomputeEdges()
}

// Fix for Windows: shift+wheel horizontal scroll is consumed by the page when at vertical
// boundaries. Stop propagation so the scroll stays within the viewport.
function onWheel(event: WheelEvent) {
	const el = viewportRef.value
	if (!el || !event.shiftKey)
		return
	if (scrollbars !== 'x' && scrollbars !== 'xy')
		return

	const atTop = el.scrollTop < 1
	const atBottom = el.scrollTop >= el.scrollHeight - el.clientHeight - 1
	const canScrollX = el.scrollWidth > el.clientWidth

	if (canScrollX && (atTop || atBottom))
		event.stopPropagation()
}

useResizeObserver([viewportRef, contentRef], recomputeEdges)

onMounted(() => {
	const el = viewportRef.value
	if (el && startScrollPosition) {
		el.scrollTo({
			left: startScrollPosition.x ?? 0,
			top: startScrollPosition.y ?? 0,
		})
	}
	recomputeEdges()
})

// Compose overscroll-behavior so single-axis scrollbars do not block the unused axis
const composedOverscroll = computed<CSSProperties['overscrollBehavior']>(() => {
	if (!overscrollBehavior)
		return undefined
	if (scrollbars === 'x')
		return `${overscrollBehavior} auto`
	if (scrollbars === 'y')
		return `auto ${overscrollBehavior}`

	return overscrollBehavior
})

const style = useVarsResolver<ScrollAreaVars>(() => ({
	root: {
		'--area-bar-size': getSize(scrollbarSize),
		'--area-overscroll': composedOverscroll.value,
	},
}))

defineExpose({
	get $el() {
		return rootRef.value?.$el as HTMLElement
	},
	/** Scrollable viewport element, use for programmatic scrolling */
	get viewport() {
		return viewportRef.value
	},
})
</script>

<template>
	<Box
		:is
		ref='rootRef'
		:style='style.root'
		:mod='[{
			type,
			scrolling,
			scrollbars,
			"offset-x": offsetScrollbars === true || offsetScrollbars === "x",
			"offset-y": offsetScrollbars === true || offsetScrollbars === "y",
			"offset-present": offsetScrollbars === "present",
			"auto-size": autoSize,
		}, mod]'
		:class='[$style.root, classes?.root]'
	>
		<div
			v-bind='viewportProps'
			ref='viewportRef'
			:class='[$style.viewport, classes?.viewport, viewportProps?.class]'
			@scroll='onScroll'
			@wheel='onWheel'
		>
			<div ref='contentRef' :class='[$style.content, classes?.content]'>
				<slot />
			</div>
		</div>
	</Box>
</template>

<style module>
.root {
	--area-bar-size: 12px;

	overflow: hidden;

	&:where([data-autosize]) .content {
		min-width: min-content;
	}
}

.content {
	display: table;

	min-width: 100%;
}

.viewport {
	overflow: hidden;
	overscroll-behavior: var(--area-overscroll);

	width: 100%;
	height: 100%;

	/* ─── Scrollbar axis ─── */

	:where([data-scrollbars='x']) & {
		overflow-x: auto;
		overflow-y: hidden;
	}

	:where([data-scrollbars='y']) & {
		overflow-x: hidden;
		overflow-y: auto;
	}

	:where([data-scrollbars='xy']) & {
		overflow: auto;
	}

	/* ─── Scrollbar visual: hover ─── */

	:where([data-type='hover']) & {
		scrollbar-color: transparent transparent;
		scrollbar-width: thin;

		&::-webkit-scrollbar-thumb {
			background: transparent;
		}
	}

	:where([data-type='hover']):hover &,
	:where([data-type='hover']) &:focus-within {
		scrollbar-color: var(--color-default-border) transparent;

		&::-webkit-scrollbar-thumb {
			background: var(--color-default-border);
		}
	}

	/* ─── Scrollbar visual: scroll ─── */

	:where([data-type='scroll']) & {
		scrollbar-color: transparent transparent;
		scrollbar-width: thin;

		&::-webkit-scrollbar-thumb {
			background: transparent;
		}
	}

	:where([data-type='scroll']) &[data-scrolling] {
		scrollbar-color: var(--color-default-border) transparent;

		&::-webkit-scrollbar-thumb {
			background: var(--color-default-border);
		}
	}

	/* ─── Scrollbar visual: auto (native) ─── */

	:where([data-type='auto']) & {
		scrollbar-color: var(--color-default-border) transparent;
		scrollbar-width: thin;

		&::-webkit-scrollbar-thumb {
			background: var(--color-default-border);
		}
	}

	/* ─── Scrollbar visual: always ─── */

	:where([data-type='always']) & {
		scrollbar-color: var(--color-default-border) transparent;
		scrollbar-width: thin;

		&::-webkit-scrollbar-thumb {
			background: var(--color-default-border);
		}
	}

	/* ─── Scrollbar visual: never ─── */

	:where([data-type='never']) & {
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	/* ─── offsetScrollbars: static padding ─── */

	:where([data-offset-x]) & {
		padding-bottom: var(--area-bar-size);
	}

	:where([data-offset-y]) & {
		padding-right: var(--area-bar-size);
	}

	/* ─── offsetScrollbars: present (reserve only when needed) ─── */

	:where([data-offset-present]) & {
		scrollbar-gutter: stable;
	}
}
</style>
