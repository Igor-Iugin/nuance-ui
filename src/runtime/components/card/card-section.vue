<script setup lang='ts'>
import type { BoxProps } from '../box.vue'

import Box from '../box.vue'
import css from './card.module.css'


export interface CardSectionProps extends BoxProps {
	withBorder?: boolean
	/** Determines whether the section should inherit padding from the parent `UiCard`, `false` by default */
	inheritPadding?: boolean
}

const { is = 'section', mod, inheritPadding, withBorder } = defineProps<CardSectionProps>()
</script>

<template>
	<Box :is :class='css.section' :mod='[mod, { "with-border": withBorder, "inherit-padding": inheritPadding }]'>
		<slot />
	</Box>
</template>
