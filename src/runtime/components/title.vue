<script setup lang='ts'>
import { computed } from 'vue'

import type { TextProps } from './text.vue'

import Text from './text.vue'


export interface TitleProps extends Omit<TextProps, 'is'> {
	order?: '1' | '2' | '3' | '4' | '5' | '6'
	textWrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'
}

const {
	order = '2',
	textWrap,
	size,
	...rest
} = defineProps<TitleProps>()

const style = computed(() => ({ '--title-text-wrap': textWrap }))
</script>

<template>
	<Text
		:is='`h${order}`'
		v-bind='rest'
		:size='size || `h${order}`'
		:class='$style.root'
		:style
	>
		<slot />
	</Text>
</template>

<style module lang='postcss'>
.root {
	--title-text-wrap: pretty;

	text-wrap: var(--title-text-wrap);
}
</style>
