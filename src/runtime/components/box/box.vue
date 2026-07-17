<script setup lang='ts'>
import type { Mod } from '@nui/utils'
import type { Component } from 'vue'

import { useTheme } from '@nui/composables'
import {


	getMod,
	getThemeColor,
	isFalsy,
} from '@nui/utils'
import { computed } from 'vue'

import type { StyleProps } from './types'

import { STYLE_MAP } from './const'


export interface BoxProps extends StyleProps {
	/**
	 * Rendered element or component
	 * @default `'div'`
	 */
	is?: keyof HTMLElementTagNameMap | Component

	/** Element modifiers transformed into `data-` attributes, falsy values are removed */
	mod?: Mod | Mod[] | Mod[][] | null
}

const props = defineProps<BoxProps>()

const theme = useTheme()

const mod = computed(() => {
	if (!props.mod)
		return null

	if (Array.isArray(props.mod)) {
		return props.mod
			.filter(i => !isFalsy(i))
			.reduce<Mod>((acc, value: Mod | Mod[]) =>
				Object.assign(acc, getMod(value)), {})
	}

	return getMod(props.mod)
})

const style = computed(() => {
	const style: Record<string, string | undefined> = {}

	for (const key in STYLE_MAP) {
		const value = props[key as keyof StyleProps]
		if (value === undefined)
			continue

		const [property, resolve] = STYLE_MAP[key as keyof StyleProps]!
		style[property] = resolve(value)
	}

	if (props.bg !== undefined)
		style.background = getThemeColor(props.bg, theme.value)
	if (props.c !== undefined)
		style.color = getThemeColor(props.c, theme.value)

	return style
})
</script>

<template>
	<component :is="props.is ?? 'div'" v-bind='mod' :style='style'>
		<slot />
	</component>
</template>
