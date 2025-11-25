<script setup lang='ts' generic='Value extends string = string, Ext extends ComboboxItemExt = object'>
import type { Mod } from '@composals'

import { computed } from 'vue'

import type { BoxProps } from '../box.vue'
import type { ComboboxItem, ComboboxItemExt, ComboboxItemProps } from './model'

import Box from '../box.vue'
import css from './combobox.module.css'
import { COMBOBOX_ATTRS } from './lib/const'
import { useComboboxState } from './lib/context'


export interface ComboboxOptionProps<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> extends Omit<BoxProps, 'is'>, ComboboxItemProps {
	data: ComboboxItem<Value, Ext>
	checked: boolean
	selected?: boolean
}

const {
	data,
	iconPosition = 'left',
	checkIcon = 'gravity-ui:check',
	withCheckIcon,
	mod: _mod,
	checked,
	selected,
} = defineProps<ComboboxOptionProps<Value, Ext>>()

defineSlots<{
	default?: (props: Required<Pick<
		ComboboxOptionProps<Value, Ext>,
		| 'withCheckIcon'
		| 'iconPosition'
		| 'data'
		| 'checked'
	>>) => any
}>()

const { onOptionSubmit } = useComboboxState()

const mod = computed(() => [
	{
		[COMBOBOX_ATTRS.option]: true,
		[COMBOBOX_ATTRS.active]: checked,
		[COMBOBOX_ATTRS.selected]: selected,
		[COMBOBOX_ATTRS.disabled]: data?.disabled,
		reverse: iconPosition === 'right',
		checked,
	},
	_mod,
] satisfies (Mod | undefined | null)[])
</script>

<template>
	<Box
		:class='css.option'
		:mod
		role='option'
		:aria-selected='checked'
		@click='() => !data?.disabled && onOptionSubmit?.(data.value, data)'
	>
		<slot
			:with-check-icon
			:icon-position
			:data
			:checked
		>
			<Icon
				v-if='withCheckIcon && iconPosition === "left"'
				:class='css.optionCheck'
				:name='data?.icon ?? checkIcon'
			/>
			<span>{{ data.label }}</span>
			<Icon
				v-if='withCheckIcon && iconPosition === "right"'
				:class='css.optionCheck'
				:name='data?.icon ?? checkIcon'
			/>
		</slot>
	</Box>
</template>
