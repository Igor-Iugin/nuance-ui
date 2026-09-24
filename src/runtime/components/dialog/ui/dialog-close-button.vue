<script lang='ts' setup>
import { useConfig } from '@nui/composables'
import { computed } from 'vue'

import type { ButtonProps } from '../../button'

import Button from '../../button/button.vue'
import { useDialogState } from '../lib'


const {
	variant = 'subtle',
	icon,
	square: _square,
	...props
} = defineProps<ButtonProps>()
const close = useDialogState()

const { icons } = useConfig()
const resolvedIcon = computed(() => icon ?? icons.close)
</script>

<template>
	<Button
		square
		:icon='resolvedIcon'
		:variant
		tabindex='0'
		v-bind='props'
		@click='close'
	>
		<slot />
	</Button>
</template>
