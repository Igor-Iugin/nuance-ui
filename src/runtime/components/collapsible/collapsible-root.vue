<script lang="ts">
import type { Ref } from 'vue'

import { toRefs } from 'vue'

import { createStrictInjection } from '#imports'

import type { BoxProps } from '../box.vue'

import Box from '../box.vue'


export interface CollapsibleRootProps extends BoxProps {
	/**
	 * The open state of the collapsible when it is initially rendered.
	 * Use when you do not need to control its open state.
	 */
	defaultOpen?: boolean

	/** When `true`, prevents the user from interacting with the collapsible. */
	disabled?: boolean

	/** When `true`, the element will be unmounted on closed state. */
	unmountOnHide?: boolean
}

interface CollapsibleRootContext {
	contentId: string
	disabled?: Ref<boolean>
	open: Ref<boolean>
	unmountOnHide: Ref<boolean>
	onOpenToggle: () => void
}

const injectionKey = Symbol('collapsible-ctx')

const [useProvide, useInject] = createStrictInjection((state: CollapsibleRootContext) => state, {
	name: 'CollapsibleRoot',
	injectionKey,
})

export const useCollapsibleState = useInject
</script>

<script setup lang='ts'>
const props = defineProps<CollapsibleRootProps>()

defineSlots<{
	default?: (props: {
		/** Current open state */
		open: typeof open.value
	}) => any
}>()

const open = defineModel<boolean>('open', { default: false })

const { disabled, unmountOnHide } = toRefs(props)

useProvide({
	contentId: '',
	disabled,
	open,
	unmountOnHide,
	onOpenToggle: () => {
		if (disabled.value)
			return

		open.value = !open.value
	},
})
</script>

<template>
	<Box :mod='[{ disabled, open: open ? "open" : "closed" }, mod]'>
		<slot :open='open' />
	</Box>
</template>
