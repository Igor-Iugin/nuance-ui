<script setup lang='ts'>
import { useFloatingIndicator, useVarsResolver } from '@nui/composables'
import { shallowRef, watch } from 'vue'

import type { BoxProps } from './box.vue'

import Box from './box.vue'


interface FloatingIndicatorVars {
	root:
		| '--fi-duration'
		| '--fi-size'
		| '--fi-position'
		| '--fi-duration'
}

export interface FloatingIndicatorProps extends BoxProps {
	/**
	* Target element over which the indicator is displayed.
	* The indicator will be positioned to match the target's size and position.
	*/
	target: HTMLElement | null | undefined

	/**
	* Parent container element that must have `position: relative`.
	* The indicator's position is calculated relative to this element.
	*/
	parent: HTMLElement | null | undefined

	/** Component orientation */
	orientation?: 'horizontal' | 'vertical'

	/** Transition duration in ms or CSS time value @default `150` */
	transitionDuration?: number | string
}

const {
	is = 'span',
	mod,
	target,
	parent,
	orientation = 'horizontal',
	transitionDuration: duration,
} = defineProps<FloatingIndicatorProps>()

const _target = shallowRef(target ?? null)
const _parent = shallowRef(parent ?? null)

watch(() => target, v => _target.value = v ?? null)
watch(() => parent, v => _parent.value = v ?? null)

// ─── Position logic ───
const { size, position } = useFloatingIndicator({
	target: _target,
	parent: _parent,
	orientation,
})

const style = useVarsResolver<FloatingIndicatorVars>(() => ({
	root: {
		'--fi-duration': duration === undefined
			? undefined
			: duration === 'number' ? `${duration}ms` : duration,
		'--fi-size': `${size.value ?? 0}px`,
		'--fi-position': `${position.value ?? 0}px`,
	},
}))
</script>

<template>
	<Box
		:is
		v-if='target && parent && size !== null'
		:style='style.root'
		:class='$style.root'
		:mod='[{ orientation }, mod]'
	/>
</template>

<style module>
.root {
  position: absolute;
  z-index: 0;

  transition-timing-function: ease;
  transition-duration: var(--fi-duration, 150ms);
  transition-property: width, height, transform;

  &:where([data-orientation='horizontal']) {
    top: 0;
    bottom: 0;
    left: 0;
    transform: translateX(var(--fi-position));

    width: var(--fi-size);
  }

  &:where([data-orientation='vertical']) {
    top: 0;
    right: 0;
    left: 0;
    transform: translateY(var(--fi-position));

    height: var(--fi-size);
  }
}
</style>
