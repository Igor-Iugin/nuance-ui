<script lang="ts">
import type { BoxProps } from '../box.vue'


export interface CollapsibleContentProps extends BoxProps {
	/**
	 * Used to force mounting when more control is needed. Useful when
	 * controlling animation with Vue animation libraries.
	 */
	forceMount?: boolean
}
</script>

<script setup lang='ts'>
import { unrefElement, useEventListener } from '@vueuse/core'
import { computed, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue'

import Box from '../box.vue'
import { useCollapsibleState } from './collapsible-root.vue'


const props = defineProps<CollapsibleContentProps>()

const ctx = useCollapsibleState()

// ─── Dimensions ───

const el = useTemplateRef<HTMLElement>('el')
const width = ref(0)
const height = ref(0)
const isMountAnimationPrevented = ref(ctx.open.value)
const savedStyle = shallowRef<{ transitionDuration: string, animationName: string }>()

watch(() => ctx.open.value, () => {
	const node = unrefElement(el)
	if (!node)
		return

	// save original transitions before first freeze
	if (!savedStyle.value) {
		savedStyle.value = {
			transitionDuration: node.style.transitionDuration,
			animationName: node.style.animationName,
		}
	}

	// freeze transitions so scrollHeight returns full dimensions unaffected by CSS
	node.style.transitionDuration = '0s'
	node.style.animationName = 'none'

	// scrollHeight/scrollWidth — real content size, unaffected by height:0 or overflow:hidden
	height.value = node.scrollHeight
	width.value = node.scrollWidth

	// restore after browser paints new dimensions so transition fires
	if (!isMountAnimationPrevented.value) {
		requestAnimationFrame(() => {
			node.style.transitionDuration = savedStyle.value!.transitionDuration
			node.style.animationName = savedStyle.value!.animationName
		})
	}
}, { immediate: true, flush: 'post' })

onMounted(() => {
	requestAnimationFrame(() => {
		isMountAnimationPrevented.value = false
	})
})

// ─── Visibility ───

const isPresent = computed(() => props.forceMount || ctx.open.value)

const dataState = computed(() => {
	if (isMountAnimationPrevented.value)
		return undefined
	return ctx.open.value ? 'open' : 'closed'
})

useEventListener(el, 'beforematch', () => {
	requestAnimationFrame(() => ctx.onOpenToggle())
})
</script>

<template>
	<Box
		v-if='ctx.unmountOnHide.value ? isPresent : true'
		v-bind='$attrs'
		:id='ctx.contentId'
		ref='el'
		:hidden='isPresent
			? undefined
			: ctx.unmountOnHide.value ? undefined : "until-found"'
		:mod='[{
			disabled: ctx.disabled,
			state: dataState,
		}, mod]'
		:style='{
			"--collapsible-content-height": `${height}px`,
			"--collapsible-content-width": `${width}px`,
		}'
	>
		<slot />
	</Box>
</template>
