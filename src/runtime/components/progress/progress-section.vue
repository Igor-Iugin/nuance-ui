<script setup lang='ts'>
import type { NuanceColor } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getThemeColor } from '@nui/utils'
import { computed } from 'vue'

import type { BoxMod } from '../box'

import Box from '../box/box.vue'
import css from './progress.module.css'


export interface ProgressSectionVars {
	root: '--progress-section-size' | '--progress-section-color'
}

export interface ProgressSectionProps {
	mod?: BoxMod

	/** Determines whether `aria-*` props should be added to the root element @default `true` */
	withAria?: boolean

	/** Color from theme */
	color?: NuanceColor

	/** If set, the section has stripes @default `false` */
	striped?: boolean

	/** If set, the sections stripes are animated, `striped` prop is ignored @default `false` */
	animated?: boolean
}

const {
	withAria,
	animated,
	striped,
	color,
	mod,
	...rest
} = defineProps<ProgressSectionProps>()

/** Value of the section in 0–100 range */
const value = defineModel<number>({ required: true })

const ariaAttributes = computed(() => withAria
	? {
		'role': 'progressbar',
		'aria-valuemax': 100,
		'aria-valuemin': 0,
		'aria-valuenow': value.value,
		'aria-valuetext': `${value.value}%`,
	}
	: {})

const style = useVarsResolver<ProgressSectionVars>(theme => ({
	root: {
		'--progress-section-size': `${value.value}%`,
		'--progress-section-color': getThemeColor(color, theme),
	},
}))
</script>

<template>
	<Box
		v-bind='{ ...rest, ...ariaAttributes }'
		:style='style.root'
		:class='css.section'
		:mod='[{ striped: striped || animated, animated }, mod]'
	>
		<slot />
	</Box>
</template>
