import type { MaybeRef, Ref } from 'vue'

import { nextTick, shallowRef, toValue, watch } from 'vue'


export interface UseAutosizeOptions {
	/** Bound textarea content. */
	model?: Ref<string | undefined>

	/** Whether autosizing is active. */
	enabled?: MaybeRef<boolean>

	/** Minimum number of visible rows. */
	minRows?: MaybeRef<number | undefined>

	/** Maximum number of visible rows before scrolling. */
	maxRows?: MaybeRef<number | undefined>
}

/**
 * Autosizes a textarea element based on its content, respecting optional row constraints.
 */
export function useAutosize(
	textarea: Readonly<Ref<HTMLTextAreaElement | null | undefined>>,
	options: UseAutosizeOptions = {},
): void {
	const { model, enabled, minRows, maxRows } = options

	// ─── Line height measurement ───

	const lineHeight = shallowRef(0)

	function measureLineHeight(el: HTMLTextAreaElement): number {
		if (lineHeight.value > 0)
			return lineHeight.value

		const saved = el.style.height
		el.style.height = '0px'
		const single = el.scrollHeight

		el.style.height = '2em'
		const double = el.scrollHeight

		el.style.height = saved

		const lh = double - single
		if (lh > 0)
			lineHeight.value = lh

		return lh || 20
	}

	// ─── Resize logic ───

	function resize(): void {
		const el = toValue(textarea)
		if (!el)
			return

		if (!toValue(enabled)) {
			el.style.height = ''
			el.style.overflowY = ''
			return
		}

		const lh = measureLineHeight(el)
		const min = toValue(minRows)
		const max = toValue(maxRows)

		el.style.height = '1px'
		const scrollH = el.scrollHeight

		let targetHeight = scrollH

		if (min != null)
			targetHeight = Math.max(targetHeight, min * lh)

		if (max != null) {
			const maxHeight = max * lh
			if (targetHeight > maxHeight) {
				targetHeight = maxHeight
				el.style.overflowY = 'auto'
			}
			else {
				el.style.overflowY = 'hidden'
			}
		}
		else {
			el.style.overflowY = 'hidden'
		}

		el.style.height = `${targetHeight}px`
	}

	watch(
		[
			textarea,
			() => toValue(model),
			() => toValue(enabled),
			() => toValue(minRows),
			() => toValue(maxRows),
		],
		() => nextTick(resize),
		{ immediate: true },
	)
}
