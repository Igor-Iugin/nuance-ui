<script lang='ts'>
// eslint-disable-next-line import/no-duplicates
import { createStrictInjection } from '@nui/composables'

import type { BoxProps } from '../box/box.vue'


interface DataListVars {
	root: '--dl-fz' | '--dl-lh' | '--dl-gap' | '--dl-label-width'
}

export interface DataListProps extends Omit<BoxProps, 'is'> {
	/** Controls `font-size` and `line-height` @default 'sm' */
	size?: NuanceSize

	/** Key of `theme.spacing` or any valid CSS value to set gap between items @default 'md' */
	gap?: NuanceSpacing

	/** Controls arrangement of label and value within each item. `horizontal` renders label and value side by side, `vertical` stacks label on top of value @default 'horizontal' */
	orientation?: 'horizontal' | 'vertical'

	/** Adds border between items @default false */
	withDivider?: boolean

	/** Controls min-width of the label (dt) element, any valid CSS value @default '120px' */
	labelWidth?: CSSProperties['minWidth']

	classes?: Classes<
		| 'root'
		| 'item'
		| 'label'
		| 'value'
	>
}

const [useProvide, useState] = createStrictInjection(
	(s: { classes: ComputedRef<DataListProps['classes']> }) => s,
	{
		name: 'DataListState',
		injectionKey: Symbol('data-list'),
	},
)

export const useDataListState = useState
</script>

<script lang="ts" setup>
import type { Classes, NuanceSize, NuanceSpacing } from '@nui/types'
import type { ComputedRef, CSSProperties } from 'vue'

// eslint-disable-next-line import/no-duplicates
import { useVarsResolver } from '@nui/composables'
import { getFontSize, getLineHeight, getSpacing } from '@nui/utils'
import { computed } from 'vue'

import Box from '../box/box.vue'
import css from './data-list.module.css'


const {
	mod,
	orientation = 'horizontal',
	withDivider,
	gap,
	size,
	labelWidth,
	classes,
	...props
} = defineProps<DataListProps>()

const style = useVarsResolver<DataListVars>(() => ({
	root: {
		'--dl-fz': getFontSize(size),
		'--dl-lh': getLineHeight(size),
		'--dl-gap': getSpacing(gap),
		'--dl-label-width': labelWidth !== undefined
			? typeof labelWidth === 'number'
				? `${labelWidth}px`
				: labelWidth
			: undefined,
	},
}))

useProvide({ classes: computed(() => classes) })
</script>

<template>
	<Box
		is='dl'
		v-bind='props'
		:style='style.root'
		:class='[css.root, classes?.root]'
		:mod='[{ orientation, "with-divider": withDivider }, mod]'
	>
		<slot />
	</Box>
</template>
