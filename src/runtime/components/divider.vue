<script setup lang="ts">
import type { AnyString, NuanceColor, NuanceSize } from '@nui/types'

import { useVarsResolver } from '@nui/composables'
import { getSize, getThemeColor } from '@nui/utils'

import type { BoxProps } from './box.vue'

import Box from './box.vue'


export type DividerVariant = 'solid' | 'dashed' | 'dotted'

export interface DividerVars {
	root: '--divider-color' | '--divider-border-style' | '--divider-size'
}

export interface DividerProps extends BoxProps {
	/** Color from theme */
	color?: NuanceColor | AnyString

	/**
	 * Controls width/height depending on orientation
	 * @default `'xs'`
	 */
	size?: NuanceSize | AnyString

	/**
	 * Label position
	 * @default `'center'`
	 */
	labelPosition?: 'left' | 'center' | 'right'

	/**
	 * Divider orientation
	 * @default `'horizontal'`
	 */
	orientation?: 'horizontal' | 'vertical'

	/** Visual variant */
	variant?: DividerVariant
}

const {
	color,
	size,
	labelPosition = 'center',
	orientation = 'horizontal',
	variant,
} = defineProps<DividerProps>()

const style = useVarsResolver<DividerVars>(theme => ({
	root: {
		'--divider-color': color ? getThemeColor(color, theme) : undefined,
		'--divider-border-style': variant,
		'--divider-size': getSize(size, 'divider-size'),
	},
}))
</script>

<template>
	<Box
		role='separator'
		:style='style.root'
		:class='$style.root'
		:mod="[{ orientation, 'with-label': !!$slots.default }, mod]"
	>
		<Box
			is='span'
			v-if='$slots.default'
			:class='$style.label'
			:mod='{ position: labelPosition }'
		>
			<slot />
		</Box>
	</Box>
</template>

<style module>
.root {
	--divider-size-xs: 1px;
	--divider-size-sm: 2px;
	--divider-size-md: 3px;
	--divider-size-lg: 4px;
	--divider-size-xl: 5px;
	--divider-size: var(--divider-size-xs);

	@mixin where-light {
		--divider-color: var(--color-gray-3);
	}

	@mixin where-dark {
		--divider-color: var(--color-dark-4);
	}

	&:where([data-orientation='horizontal']) {
		border-top: var(--divider-size) var(--divider-border-style, solid) var(--divider-color);
	}

	&:where([data-orientation='vertical']) {
		align-self: stretch;

		height: auto;
		border-inline-start: var(--divider-size) var(--divider-border-style, solid) var(--divider-color);
	}

	&:where([data-with-label]) {
		border: 0;
	}
}

.label {
	display: flex;
	align-items: center;

	font-size: var(--font-size-xs);
	color: var(--color-dimmed);
	white-space: nowrap;

	&:where([data-position='left'])::before {
		display: none;
	}

	&:where([data-position='right'])::after {
		display: none;
	}

	&::before {
		content: '';

		flex: 1;

		height: 1px;
		margin-inline-end: var(--spacing-xs);
		border-top: var(--divider-size) var(--divider-border-style, solid) var(--divider-color);
	}

	&::after {
		content: '';

		flex: 1;

		height: 1px;
		margin-inline-start: var(--spacing-xs);
		border-top: var(--divider-size) var(--divider-border-style, solid) var(--divider-color);
	}
}
</style>
