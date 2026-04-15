<script setup lang='ts'>
import type { BoxProps } from '@nui/components'
import type { ComponentFactory, NuanceColor } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getThemeColor } from '@nui/utils'
import { computed } from 'vue'

import Box from '../box.vue'
import css from './progress.module.css'


export interface ProgressSectionVars {
	root: '--progress-section-size' | '--progress-section-color'
}

type ProgressSectionFactory = ComponentFactory<{
	props: BoxProps & {
		/** Determines whether `aria-*` props should be added to the root element @default `true` */
		withAria?: boolean

		/** Color from theme */
		color?: NuanceColor

		/** If set, the section has stripes @default `false` */
		striped?: boolean

		/** If set, the sections stripes are animated, `striped` prop is ignored @default `false` */
		animated?: boolean
	}
	classes: never
	vars: ProgressSectionVars
}>

export type ProgressSectionProps = ProgressSectionFactory['props']

const {
	withAria,
	animated,
	striped,
	color,
	mod,
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

const style = useVarsResolver<ProgressSectionFactory>(theme => ({
	root: {
		'--progress-section-size': `${value.value}%`,
		'--progress-section-color': getThemeColor(color, theme),
	},
}))
</script>

<template>
	<Box
		:style='style.root'
		v-bind='ariaAttributes'
		:class='css.section'
		:mod='[{ striped: striped || animated, animated }, mod]'
	>
		<slot />
	</Box>
</template>
