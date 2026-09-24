<script setup lang='ts'>
import { computed } from 'vue'

import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'


export interface ButtonBaseProps extends BoxProps {
	/** Resolved link href — renders an `a` element when set and `is` is not overridden */
	href?: string | null

	/** Link target attribute */
	target?: string | null

	/** Link rel attribute */
	rel?: string | null

	/** Native button type @default 'button' */
	type?: 'button' | 'submit' | 'reset'

	/** Disables the component */
	disabled?: boolean

	/** Router navigation callback provided by `NuxtLink custom` */
	navigate?: (event: MouseEvent) => void

	onClick?: ((event: MouseEvent) => void) | Array<(event: MouseEvent) => void>
}

const {
	is,
	href,
	target,
	rel,
	type = 'button',
	disabled,
	navigate,
	onClick,
	...props
} = defineProps<ButtonBaseProps>()

const element = computed(() => is ?? (href ? 'a' : 'button'))
const isAnchor = computed(() => element.value === 'a')

function handleClick(event: MouseEvent) {
	if (disabled) {
		event.preventDefault()
		event.stopPropagation()
		return
	}

	const handlers = Array.isArray(onClick) ? onClick : onClick ? [onClick] : []
	for (const handler of handlers)
		handler(event)

	// Internal links are resolved by NuxtLink, external ones keep the native behaviour
	if (navigate && !target && !event.defaultPrevented)
		navigate(event)
}
</script>

<template>
	<Box
		:is='element'
		v-bind='props'
		:href='isAnchor ? href ?? undefined : undefined'
		:target='isAnchor ? target ?? undefined : undefined'
		:rel='isAnchor ? rel ?? undefined : undefined'
		:type='isAnchor ? undefined : type'
		:disabled='!isAnchor && disabled ? true : undefined'
		:aria-disabled='isAnchor && disabled ? "true" : undefined'
		@click='handleClick'
	>
		<slot />
	</Box>
</template>
