<script setup lang='ts'>
import { computed } from 'vue'


export type TransitionName
	= 'fade'
		| 'fade-down'
		| 'fade-up'
		| 'fade-left'
		| 'fade-right'
		| 'skew-up'
		| 'skew-down'
		| 'rotate-right'
		| 'rotate-left'
		| 'slide-down'
		| 'slide-up'
		| 'slide-right'
		| 'slide-left'
		| 'scale-y'
		| 'scale-x'
		| 'scale'
		| 'pop'
		| 'pop-top-left'
		| 'pop-top-right'
		| 'pop-bottom-left'
		| 'pop-bottom-right'

export interface TransitionProps {
	/**
	 * Transition animation name
	 * @default `'pop-bottom-left'`
	 */
	name?: TransitionName

	/**
	 * Transition duration in ms
	 * @default `250`
	 */
	duration?: number

	/**
	 * Transition delay in ms
	 * @default `0`
	 */
	delay?: number
	/**
   * Controls the timing sequence of leaving/entering transitions.
   * Default behavior is simultaneous.
   */
	mode?: 'in-out' | 'out-in' | 'default'
	/**
   * Whether to apply transition on initial render.
   * Default: false
   */
	appear?: boolean
}

const {
	name = 'pop-bottom-left',
	duration = 250,
	delay,
	appear,
	mode,
} = defineProps<TransitionProps>()

const emit = defineEmits<{
	afterLeave: []
}>()

const style = computed(() => ({
	'--transition-duration': `${duration}ms`,
	'--transition-delay': delay ? `${delay}ms` : undefined,
}))
</script>

<template>
	<Transition
		:style
		:name
		:mode
		:appear
		@after-leave='() => emit("afterLeave")'
	>
		<slot />
	</Transition>
</template>
