<script lang="ts">
import type { AnyString, NuanceColor } from '@nui/types'

import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'


export interface MenuBaseItemProps extends BoxProps {
	/** Left icon */
	icon?: string

	/** Right icon */
	trailingIcon?: string

	description?: string

	/** Color from theme */
	color?: NuanceColor | AnyString

	/** Disables the item */
	disabled?: boolean

	active?: boolean
	staticRSection?: boolean
}
</script>

<script lang="ts" setup>
import { useVarsResolver } from '@nui/composables'
import { getThemeColor } from '@nui/utils'

import UnstyledButton from '../button/unstyled-button.vue'
import css from './menu.module.css'
import { useMenuState } from './menu.vue'


const {
	mod,
	icon,
	trailingIcon,
	description,
	color,
	disabled,
	active,
	staticRSection,
	...rest
} = defineProps<MenuBaseItemProps>()

const ctx = useMenuState()

const style = useVarsResolver<{
	root: '--menu-item-color'
}>(theme => ({
	root: {
		'--menu-item-color': color ? getThemeColor(color, theme) : undefined,
	},
}))
</script>

<template>
	<UnstyledButton
		data-menu-item
		v-bind='rest'
		:mod='[{ active, disabled }, mod]'
		:disabled
		:tabindex='ctx.menuItemTabIndex.value'
		:style='style.root'
		:class='[css.item, ctx.classes.value?.item]'
		@mousedown.prevent
	>
		<div
			v-if='$slots.leftSection || icon'
			:class='[css.itemSection, ctx.classes.value?.itemSection]'
			data-position='left'
		>
			<slot name='leftSection'>
				<Icon v-if='icon' :name='icon' />
			</slot>
		</div>

		<div
			:class='[css.itemLabel, ctx.classes.value?.itemLabel]'
			data-menu-item-label
		>
			<span>
				<slot />
			</span>
			<span v-if='description' :class='css.itemDescription'>
				{{ description }}
			</span>
		</div>

		<Box
			v-if='$slots.rightSection || trailingIcon || staticRSection'
			:class='[css.itemSection, ctx.classes.value?.itemSection]'
			data-position='right'
			:mod='{ static: staticRSection }'
		>
			<slot name='rightSection'>
				<Icon v-if='trailingIcon' :name='trailingIcon' />
			</slot>
		</Box>
	</UnstyledButton>
</template>
