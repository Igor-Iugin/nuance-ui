import type { Placement } from '@floating-ui/vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

import { useEventListener, useTimeoutFn } from '@vueuse/core'
import { computed, ref, shallowRef, toValue, watch } from 'vue'

import type { SafePolygonOptions } from './safe-polygon'

import { safePolygon } from './safe-polygon'


function getOppositePlacement(placement: Placement): Placement {
	return placement.replace(
		/top|bottom|left|right/,
		side => ({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' })[side]!,
	) as Placement
}

export interface UseInteractionOptions {
	reference: MaybeRefOrGetter<HTMLElement | null | undefined>
	floating: MaybeRefOrGetter<HTMLElement | null | undefined>
	placement: MaybeRefOrGetter<Placement>

	/** Open delay in ms @default `0` */
	openDelay?: MaybeRefOrGetter<number>

	/** Close delay in ms @default `0` */
	closeDelay?: MaybeRefOrGetter<number>

	/**
	 * Keeps the floating element open while the pointer travels from the reference to it,
	 * using a dynamic safe area instead of closing as soon as the pointer leaves the reference.
	 * @default `false`
	 */
	interactive?: MaybeRefOrGetter<boolean | SafePolygonOptions>

	/** Disables the listeners @default `false` */
	disabled?: MaybeRefOrGetter<boolean>
}

/**
 * Tracks hover state across a reference and a floating element, like CSS `:hover` but merged
 * across both. Port of floating-ui/react's `useHover` restricted to the mouse + `safePolygon` path.
 */
export function useInteraction(options: UseInteractionOptions): Readonly<Ref<boolean>> {
	const opened = ref(false)

	const openDelay = computed(() => toValue(options.openDelay) ?? 0)
	const closeDelay = computed(() => toValue(options.closeDelay) ?? 0)

	const openTimer = useTimeoutFn(() => (opened.value = true), openDelay, { immediate: false })
	const closeTimer = useTimeoutFn(() => (opened.value = false), closeDelay, { immediate: false })

	// ─── Safe polygon ───
	const polygonListener = shallowRef<((event: MouseEvent) => void) | null>(null)

	useEventListener(
		() => (polygonListener.value ? document : null),
		'mousemove',
		(event: MouseEvent) => polygonListener.value?.(event),
	)

	// ─── State ───
	function cancel() {
		polygonListener.value = null
		openTimer.stop()
		closeTimer.stop()
	}

	function open() {
		cancel()

		if (openDelay.value)
			openTimer.start()
		else
			opened.value = true
	}

	function close() {
		cancel()

		if (closeDelay.value)
			closeTimer.start()
		else
			opened.value = false
	}

	const disabled = computed(() => !!toValue(options.disabled))
	const interactive = computed(() => toValue(options.interactive))

	watch(disabled, isDisabled => {
		if (isDisabled) {
			cancel()
			opened.value = false
		}
	})

	/**
	 * Arms the safe area for a pointer leaving `from` towards `to`, falling back to closing
	 * right away when the safe area is disabled or either element is missing.
	 */
	function leave(event: MouseEvent, from: 'reference' | 'floating') {
		const referenceEl = toValue(options.reference)
		const floatingEl = toValue(options.floating)
		const interactiveValue = interactive.value

		if (!interactiveValue || !referenceEl || !floatingEl) {
			close()
			return
		}

		const fn = safePolygon(typeof interactiveValue === 'object' ? interactiveValue : undefined)
		const placement = toValue(options.placement)
		// Travelling back: the roles swap, so the safe area spans the same gap in reverse.
		const back = from === 'floating'

		polygonListener.value = fn({
			x: event.clientX,
			y: event.clientY,
			placement: back ? getOppositePlacement(placement) : placement,
			reference: back ? floatingEl : referenceEl,
			floating: back ? referenceEl : floatingEl,
			onClose: close,
		})
	}

	// ─── Listeners ───
	useEventListener(options.reference, 'mouseenter', () => {
		if (disabled.value)
			return

		// Coming back from the floating element: already open, so skip the open delay.
		if (opened.value) {
			cancel()
			return
		}

		open()
	})

	useEventListener(options.reference, 'mouseleave', (event: MouseEvent) => {
		if (!disabled.value)
			leave(event, 'reference')
	})

	useEventListener(options.floating, 'mouseenter', () => {
		if (!disabled.value)
			cancel()
	})

	useEventListener(options.floating, 'mouseleave', (event: MouseEvent) => {
		if (!disabled.value)
			leave(event, 'floating')
	})

	return opened
}
