<script setup lang='ts'>
import type { BoxProps } from '@nui/components'
import type { NuanceColor } from '@nui/types'

import { useStyleResolver } from '@nui/composals'
import { getThemeColor } from '@nui/utils'
import { computed } from 'vue'

import Box from '../box.vue'
import css from './progress.module.css'


export interface ProgressSectionProps extends BoxProps {
	/** Determines whether `aria-*` props should be added to the root element @default `true` */
	withAria?: boolean

	/** Key of `theme.colors` or any valid CSS value @default `theme.primaryColor` */
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

const style = computed(() => useStyleResolver(theme => ({
	'--progress-section-size': `${value.value}%`,
	'--progress-section-color': getThemeColor(color, theme),
})))
</script>

<template>
	<Box
		:style
		v-bind='ariaAttributes'
		:class='css.section'
		:mod='[{ striped: striped || animated, animated }, mod]'
	/>
</template>
