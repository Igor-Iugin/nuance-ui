import type { Ref } from 'vue'

import { unrefElement, useResizeObserver } from '@vueuse/core'
import { nextTick, onMounted, ref, watch } from 'vue'


export interface UseFloatingIndicatorOptions {
	target: Readonly<Ref<HTMLElement | null>>
	parent: Readonly<Ref<HTMLElement | null>>
	orientation?: 'horizontal' | 'vertical'
}

export interface UseFloatingIndicatorReturn {
	size: Readonly<Ref<number | null>>
	position: Readonly<Ref<number | null>>
}

export function useFloatingIndicator({
	target,
	parent,
	orientation = 'horizontal',
}: UseFloatingIndicatorOptions): UseFloatingIndicatorReturn {
	const size = ref<number | null>(null)
	const position = ref<number | null>(null)

	function updatePosition() {
		const targetEl = unrefElement(target)
		const parentEl = unrefElement(parent)
		if (!targetEl || !parentEl)
			return

		const targetRect = targetEl.getBoundingClientRect()
		const parentRect = parentEl.getBoundingClientRect()

		if (orientation === 'horizontal') {
			size.value = targetEl.offsetWidth
			position.value = targetRect.left - parentRect.left
		}
		else {
			size.value = targetEl.offsetHeight
			position.value = targetRect.top - parentRect.top
		}
	}

	watch(target, () => nextTick(updatePosition))
	watch(parent, () => nextTick(updatePosition))

	useResizeObserver([target, parent], updatePosition)

	onMounted(updatePosition)

	return { size, position }
}
