<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import css from './card.module.css'


export interface CardSectionProps extends BoxProps {
	/** Shows a top border */
	withBorder?: boolean

	/** Inherits horizontal padding from the parent card */
	inheritPadding?: boolean
}

const { is = 'section', mod, inheritPadding, withBorder } = defineProps<CardSectionProps>()
</script>

<template>
	<Box :is :class='css.section' :mod='[mod, { "with-border": withBorder, "inherit-padding": inheritPadding }]'>
		<slot />
	</Box>
</template>
