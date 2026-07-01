<script setup lang='ts'>
import { computed } from 'vue'

import type { TransitionName } from './transition.vue'


export interface TransitionGroupProps {
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

	/** Wrapper element/component rendered around the list @default `'div'` */
	tag?: string

	/** Whether to apply transition on initial render @default `false` */
	appear?: boolean
}

const {
	name = 'pop-bottom-left',
	duration = 250,
	delay,
	tag = 'div',
	appear,
} = defineProps<TransitionGroupProps>()

const style = computed(() => ({
	'--transition-duration': `${duration}ms`,
	'--transition-delay': delay ? `${delay}ms` : undefined,
}))
</script>

<template>
	<TransitionGroup
		:style
		:name
		:tag
		:appear
		move-class='transition-move'
	>
		<slot />
	</TransitionGroup>
</template>
