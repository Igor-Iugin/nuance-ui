<script lang='ts' setup>
import type { ActionIconProps } from '../action-icon'

import { ActionIcon } from '../action-icon'
import { useDialogState } from './lib'


const { variant = 'subtle', icon = 'gravity-ui:xmark', ...props } = defineProps<ActionIconProps>()
const close = useDialogState()
</script>

<template>
	<ActionIcon
		:icon
		:variant
		tabindex='0'
		v-bind='props'
		@click='close'
	>
		<slot />
	</ActionIcon>
</template>
