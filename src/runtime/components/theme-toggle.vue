<script lang='ts' setup>
import { useConfig, useTheme } from '@nui/composables'

import type { ActionIconProps } from './action-icon'

import ActionIcon from './action-icon/action-icon.vue'


const props = defineProps<ActionIconProps>()

const theme = useTheme()
const { icons } = useConfig()
</script>

<template>
	<ActionIcon
		v-bind='props'
		:icon='theme.value === "light" ? icons.moon : icons.sun'
		@click='theme.preference = theme.value === "light" ? "dark" : "light"'
	>
		<slot />
	</ActionIcon>
</template>
