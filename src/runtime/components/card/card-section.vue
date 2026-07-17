<script setup lang='ts'>
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './card.module.css'


export interface CardSectionProps extends BoxProps {
	/** Shows a top border */
	withBorder?: boolean

	/** Inherits horizontal padding from the parent card */
	inheritPadding?: boolean
}

const {
	is = 'section',
	mod,
	inheritPadding,
	withBorder,
	...rest
} = defineProps<CardSectionProps>()
</script>

<template>
	<Box
		:is
		:mod='[{
			"with-border": withBorder,
			"inherit-padding": inheritPadding,
		}, mod]'
		v-bind='rest'
		:class='css.section'
	>
		<slot />
	</Box>
</template>
