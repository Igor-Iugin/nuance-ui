import type { MaybeRefOrGetter } from 'vue'

import { useTimeoutFn } from '@vueuse/core'


export function useDelayedHover({
	open,
	close,
	openDelay,
	closeDelay,
}: {
	open: () => void
	close: () => void
	openDelay: MaybeRefOrGetter<number>
	closeDelay: MaybeRefOrGetter<number>
}) {
	const {
		start: scheduleOpen,
		stop: cancelOpen,
	} = useTimeoutFn(open, openDelay, { immediate: false })
	const {
		start: scheduleClose,
		stop: cancelClose,
	} = useTimeoutFn(close, closeDelay, { immediate: false })

	return {
		open: () => {
			cancelClose()
			cancelOpen()
			scheduleOpen()
		},
		close: () => {
			cancelOpen()
			cancelClose()
			scheduleClose()
		},
	}
}
