<script lang='ts' setup>
import type { TitleProps } from '../../title.vue'

import Title from '../../title.vue'
import css from './dialog.module.css'


export interface DialogTitleProps extends TitleProps {
}

const { size = 'md', lh = '1', ...props } = defineProps<DialogTitleProps>()
</script>

<template>
	<Title :class='css.title' :lh :size v-bind='props'>
		<slot />
	</Title>
</template>
