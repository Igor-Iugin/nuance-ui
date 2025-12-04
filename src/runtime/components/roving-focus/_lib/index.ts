import type { ShallowRef } from 'vue'

import { createStrictInjection } from '@nui/helpers'
import { unrefElement } from '@vueuse/core'
import { nextTick } from 'vue'


const SELECT_ATTR = 'data-roving-item' as const

interface State {
	/** Ref to the container that holds all roving items */
	list: Readonly<ShallowRef<HTMLElement | null>>
	/** Whether focus should loop from last to first and vice versa */
	loop?: boolean
	/** Keyboard navigation direction */
	orientation?: 'vertical' | 'horizontal' | 'both'
	/** Custom attribute to mark items instead of data-roving-item */
	attr?: string
}

const injectionKey = Symbol('roving-focus')
const [useProvide, useState] = createStrictInjection(({ list, loop, orientation, attr = SELECT_ATTR }: State) => {
	/**
	 * Returns an array of all focusable roving items inside the container.
	 * Items are selected by the `[data-roving-item]:not(:disabled)` selector.
	 */
	const getItems = () => Array.from(
		unrefElement(list)?.querySelectorAll(`[${attr}]:not(:disabled)`) ?? [],
	) as HTMLElement[]

	/**
	 * Focuses a given element and makes it the only one with tabindex="0".
	 */
	const focusElement = (element?: HTMLElement) => {
		if (!element)
			return

		element.setAttribute('tabindex', '0')
		nextTick(() => element.focus())
	}

	/**
	 * Moves focus within the roving focus group.
	 *
	 * @example
	 * // Move to the first item
	 * focus('first')
	 *
	 * // Move to the next item from the current one
	 * focus('next', currentElement)
	 *
	 * // Move to the previous item
	 * focus('prev', currentElement)
	 */
	function focus(dir: 'first' | 'last'): void
	function focus(dir: 'prev' | 'next', element: HTMLElement | undefined | null): void
	function focus(dir: 'prev' | 'next' | 'first' | 'last', element?: HTMLElement | null) {
		if (!element && dir !== 'first' && dir !== 'last')
			return

		const values = getItems()
		const currentIndex = element ? values.indexOf(element) : -1
		let nextIndex = currentIndex

		switch (dir) {
			case 'first':
				nextIndex = 0
				break
			case 'last':
				nextIndex = values.length - 1
				break
			case 'next': {
				nextIndex = currentIndex + 1
				if (nextIndex >= values.length)
					nextIndex = loop ? 0 : values.length - 1
				break
			}
			case 'prev': {
				nextIndex = currentIndex - 1
				if (nextIndex < 0)
					nextIndex = loop ? values.length - 1 : 0
				break
			}
		}

		if (nextIndex !== currentIndex && values[nextIndex] !== undefined) {
			element?.setAttribute('tabindex', '-1')
			focusElement(values[nextIndex])
		}
	}

	/**
	 * Initializes the roving focus group by setting the first item as focusable.
	 * Should be called once after the component is mounted and all items are in the DOM.
	 *
	 * @example
	 * onMounted(() => nextTick(() => init()))
	 */
	function init() {
		const values = getItems()
		const element = values[0]
		element?.setAttribute('tabindex', '0')
	}

	return ({
		attr,
		list,
		loop,
		orientation,
		focus,
		getItems,
		focusElement,
		init,
	})
}, {
	injectionKey,
	name: 'RovingFocus',
})
/**
 * Provides the roving focus context to descendants.
 * Must be called in the parent component that wraps the roving items.
 *
 * @example
 * const { init } = useProvideRovingFocus({ list: containerRef, loop: true })
 */
export const useProvideRovingFocus = useProvide

/**
 * Consumes the roving focus context.
 * Use inside each roving focus item to get access to navigation methods.
 */
export const useRovingFocus = useState
