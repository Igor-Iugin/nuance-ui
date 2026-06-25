<script lang='ts' setup>
import { useConfig } from '@nui/composables'
import { computed } from 'vue'

import type { ActionIconProps } from '../../action-icon'

import ActionIcon from '../../action-icon/action-icon.vue'
import { useDialogState } from '../lib'


const {
	variant = 'subtle',
	icon,
	...props
} = defineProps<ActionIconProps>()
const close = useDialogState()

const { icons } = useConfig()
const resolvedIcon = computed(() => icon ?? icons.close)
</script>

<template>
	<ActionIcon
		:icon='resolvedIcon'
		:variant
		tabindex='0'
		v-bind='props'
		@click='close'
	>
		<slot />
	</ActionIcon>
</template>
