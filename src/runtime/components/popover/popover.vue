<script setup lang='ts'>
import { unrefElement } from '@vueuse/core'
import { onBeforeMount, onMounted, useId, watch } from 'vue'

import type { PopoverEmits, PopoverModel, PopoverProps } from './types'

import { useProvidePopoverState } from './lib/context'
import { usePopover } from './lib/use-popover'


defineOptions({ inheritAttrs: false })

const {
	placement = 'bottom',
	offset = 8,
	arrowSize,
	arrowRadius,
	arrowOffset = 5,
	arrowPosition = 'center',
	width = 'max-content',
	disabled,
	floatingStrategy = 'fixed',
	radius,
	shadow,
	withArrow = false,
} = defineProps<PopoverProps>()

const emit = defineEmits<PopoverEmits>()

const uid = useId()
const opened = defineModel<PopoverModel['open']>('open', { default: false })

const store = usePopover({
	placement,
	strategy: floatingStrategy,
	opened,
	arrowOffset,
	arrowPosition,
	arrowRadius,
	arrowSize,
	offset: typeof offset === 'number' ? offset + (withArrow ? (arrowSize ?? 7) / 2 : 0) : offset,
	width,
	withArrow,
})

function sync(value: boolean, emitting: boolean = true) {
	if (value) {
		unrefElement(store.dropdownRef)?.showPopover()
		emitting && emit('open')
	}
	else {
		unrefElement(store.dropdownRef)?.hidePopover()
		emitting && emit('close')
	}
}

// Sync v-model with popover
watch(opened, isOpen => sync(isOpen), { flush: 'post' })
onMounted(() => {
	if (!opened.value)
		return

	sync(opened.value, false)
})
onBeforeMount(() => sync(false))

useProvidePopoverState({
	id: uid,
	disabled,
	onToggle: e => opened.value = e.newState === 'open',
	store,
	withArrow,
	shadow,
	radius,
})
</script>

<template>
	<slot />
</template>
