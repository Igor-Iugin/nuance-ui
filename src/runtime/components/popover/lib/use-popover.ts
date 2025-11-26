import type { OffsetOptions, Placement, Strategy } from '@floating-ui/vue'
import type { CSSProperties, ModelRef, Ref, ShallowRef } from 'vue'

import { arrow, autoUpdate, flip, hide, inline, limitShift, offset, shift, size, useFloating } from '@floating-ui/vue'
import { computed, shallowRef } from 'vue'

import type { ArrowPosition, PopoverWidth } from '../types'

import { getArrowPosition } from './get-arrow-position'


export interface PopoverOptions {
	offset: OffsetOptions
	placement: Placement
	opened: ModelRef<boolean>
	width: PopoverWidth
	arrowOffset: number
	arrowRadius: number | undefined
	arrowPosition: ArrowPosition
	arrowSize: number | undefined
	withArrow: boolean
	strategy?: Strategy
}

export interface UsePopoverReturn {
	arrowStyles: Readonly<Ref<CSSProperties>>
	floatingStyles: Readonly<Ref<CSSProperties>>
	arrowRef: ShallowRef<HTMLElement | null>
	targetRef: ShallowRef<HTMLElement | null>
	dropdownRef: ShallowRef<HTMLElement | null>
}

export function usePopover(options: PopoverOptions): UsePopoverReturn {
	const { opened, strategy, placement } = options

	const arrowRef = shallowRef<HTMLElement | null>(null)
	const targetRef = shallowRef<HTMLElement | null>(null)
	const dropdownRef = shallowRef<HTMLElement | null>(null)

	const middleware = computed(() => [
		offset(options.offset),
		hide(),
		shift({ limiter: limitShift(), padding: 5 }),
		inline(),
		flip(),
		size(({ elements }) => ({
			padding: 4,
			apply({ rects, availableWidth, availableHeight }) {
				const floating = elements.floating
				const styles = floating.style ?? {}

				floating.style.maxWidth = `${Math.max(0, availableWidth)}px`
				floating.style.maxHeight = availableHeight >= floating.scrollHeight
					? ''
					: `${Math.max(0, availableHeight)}px`

				if (options.width === 'target')
					Object.assign(styles, { width: `${rects.reference.width}px` })
			},
		})),
		arrow({ element: arrowRef.value, padding: options.arrowOffset }),
	])

	const { middlewareData, floatingStyles } = useFloating(targetRef, dropdownRef, {
		strategy,
		placement,
		middleware,
		whileElementsMounted: autoUpdate,
		open: opened,
	})

	const arrowStyles = computed(() => getArrowPosition({
		...options,
		arrowX: middlewareData.value.arrow?.x,
		arrowY: middlewareData.value.arrow?.y,
	}))

	return {
		arrowStyles,
		floatingStyles,
		arrowRef,
		targetRef,
		dropdownRef,
	}
}
