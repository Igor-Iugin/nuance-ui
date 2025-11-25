<script setup lang='ts'>
import type { UiKitColor, UiKitSize } from '@nui/types'
import type { Component } from 'vue'

import { useStyleResolver } from '@nui/composals'
import { getSize, parseThemeColor } from '@nui/utils'
import { computed } from 'vue'

import BarsLoader from './_loaders/bars-loader.vue'
import DotsLoader from './_loaders/dots-loader.vue'
import OvalLoader from './_loaders/oval-loader.vue'


export type LoaderType = 'bars' | 'dots' | 'oval'

export interface LoaderProps {
	size?: UiKitSize | string
	color?: UiKitColor | string
	type?: LoaderType
}

const {
	size = 'sm',
	color,
	type = 'oval',
} = defineProps<LoaderProps>()

const loaders: Record<LoaderType, Component> = {
	bars: BarsLoader,
	oval: OvalLoader,
	dots: DotsLoader,
}

const style = computed(() => useStyleResolver(theme => {
	const _color = parseThemeColor({ color, theme })

	return {
		'--loader-size': getSize(size, 'loader-size'),
		'--loader-color': _color.value,
	}
}))
</script>

<template>
	<component :is='loaders[type]' :class='$style.root' :style />
</template>

<style module>
.root {
	--loader-size-xs: rem(18px);
	--loader-size-sm: rem(22px);
	--loader-size-md: rem(36px);
	--loader-size-lg: rem(44px);
	--loader-size-xl: rem(58px);
	--loader-size: var(--loader-size-md);
	--loader-color: var(--color-primary-filled);
}
</style>
