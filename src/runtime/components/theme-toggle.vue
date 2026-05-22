<script lang='ts' setup>
import { useTheme } from '@nui/composables'

import type { ActionIconProps } from './action-icon'

import ActionIcon from './action-icon/action-icon.vue'


const props = defineProps<ActionIconProps>()

const theme = useTheme()
</script>

<template>
	<ActionIcon
		v-bind='props'
		:icon='theme.value === "light" ? "gravity-ui:moon" : "gravity-ui:sun"'
		@click='theme.preference = theme.value === "light" ? "dark" : "light"'
	>
		<slot />
	</ActionIcon>
</template>
