<script setup lang='ts'>
import type { UiKitSpacing } from '@types'

import { getSpacing } from '@utils'
import { computed } from 'vue'

import type { PaperProps } from '../paper.vue'

import Paper from '../paper.vue'
import css from './card.module.css'


export interface CardProps extends PaperProps {
	padding?: UiKitSpacing
}

const { padding, is = 'article', ...rest } = defineProps<CardProps>()
const style = computed(() => ({
	'--card-padding': getSpacing(padding),
}))
</script>

<template>
	<Paper :is :style :class='css.root' v-bind='rest'>
		<slot />
	</Paper>
</template>
