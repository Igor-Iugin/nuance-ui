<script setup lang='ts'>
import type { BoxProps } from '@nui/components'
import type { AnyString, NuanceSpacing } from '@nui/types'

import { getSpacing } from '@nui/utils'
import { computed } from 'vue'

import Box from '../box/box.vue'
import css from './avatar.module.css'
import { useProvideAvatarGroup } from './lib/context'


export interface AvatarGroupProps extends BoxProps {
	/** Negative spacing applied between child avatars to overlap them */
	spacing?: NuanceSpacing | AnyString
}

const { spacing, ...rest } = defineProps<AvatarGroupProps>()

const style = computed(() => ({
	'--ag-spacing': getSpacing(spacing),
}))

useProvideAvatarGroup()
</script>

<template>
	<Box :style v-bind='rest' :class='css.group'>
		<slot />
	</Box>
</template>
