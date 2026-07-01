import type { Ref } from 'vue'

import { useIntervalFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'


export interface UseCountdownOptions {
	/** Countdown duration in ms, `0` disables the timer */
	duration: number
	/** Interval step in ms @default 16 */
	step?: number
	/** Whether the timer is currently paused */
	paused?: Ref<boolean>
	/** Called when the countdown reaches 0 */
	onComplete: () => void
}

export interface UseCountdownReturn {
	/** Remaining time in ms */
	remaining: Ref<number>
	/** Remaining time as a percentage of the total duration, `0` if duration is `0` */
	progress: Ref<number>
}

/** Countdown timer driven by `useIntervalFn`, pausable via an external ref. */
export function useCountdown({
	duration,
	step = 16,
	paused,
	onComplete,
}: UseCountdownOptions): UseCountdownReturn {
	const active = duration > 0
	const remaining = ref(duration)
	const progress = computed(() => active
		? (remaining.value / duration) * 100
		: 0)

	const { pause, resume } = useIntervalFn(() => {
		remaining.value -= step
		if (remaining.value <= 0) {
			pause()
			onComplete()
		}
	}, step, { immediate: active && !paused?.value })

	if (paused) {
		watch(paused, isPaused => {
			if (!active)
				return

			if (isPaused)
				pause()
			else
				resume()
		})
	}

	return { remaining, progress }
}
