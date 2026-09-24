<script lang='ts' setup>
import { useConfig, useTheme } from '@nui/composables'

import type { ButtonProps } from './button'

import Button from './button/button.vue'


const {
	square: _square,
	...props
} = defineProps<ButtonProps>()

const theme = useTheme()
const { icons } = useConfig()
</script>

<template>
	<Button
		square
		v-bind='props'
		:icon='theme.value === "light" ? icons.moon : icons.sun'
		@click='theme.preference = theme.value === "light" ? "dark" : "light"'
	>
		<slot />
	</Button>
</template>
