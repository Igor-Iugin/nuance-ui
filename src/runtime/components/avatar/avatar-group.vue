<script setup lang='ts'>
import type { BoxProps } from '@nui/components'
import type { NuanceSpacing } from '@nui/types'

import { getSpacing } from '@nui/utils'
import { computed } from 'vue'

import Box from '../box.vue'
import { useProvideAvatarGroup } from './_lib/context'
import css from './avatar.module.css'


export interface AvatarGroupProps extends BoxProps {
	/** Negative space between Avatar components @default `'sm'` */
	spacing?: NuanceSpacing | string
}

const { mod, is, spacing } = defineProps<AvatarGroupProps>()

const style = computed(() => ({
	'--ag-spacing': getSpacing(spacing),
}))

useProvideAvatarGroup()
</script>

<template>
	<Box :is :style :mod :class='css.group'>
		<slot />
	</Box>
</template>
