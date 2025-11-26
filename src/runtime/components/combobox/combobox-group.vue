<script setup lang='ts' generic='Value extends string = string, Ext extends ComboboxItemExt = object'>
import { useId } from 'vue'

import type { BoxProps } from '../box.vue'
import type { ComboboxItem, ComboboxItemExt, ComboboxItemGroup, ComboboxItemProps } from './types'

import Box from '../box.vue'
import ComboboxOption from './combobox-option.vue'
import css from './combobox.module.css'
import { isValueChecked } from './lib/utils'


export interface ComboboxGroupProps<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> extends /* @vue-ignore */ Omit<BoxProps, 'is'>, ComboboxItemProps {
	/** Group label */
	label?: string

	data: ComboboxItemGroup<Value, Ext>
}

const {
	label,
	mod,
	data,
	iconPosition,
	checkIcon,
	withCheckIcon,
} = defineProps<ComboboxGroupProps<Value, Ext>>()

const uid = useId()

const value = defineModel<ComboboxItem<Value, Ext> | ComboboxItem<Value, Ext>[] | null>('value')
</script>

<template>
	<Box :class='css.group' role='group' :aria-labelledby='label ? uid : undefined' :mod>
		<div v-if='label || $slots?.label' :id='uid' :class='css.groupLabel'>
			<slot name='label'>
				{{ label }}
			</slot>
		</div>

		<ComboboxOption
			v-for='item in data.items'
			:key='item.value'
			:data='item'
			:icon-position
			:with-check-icon
			:check-icon
			:checked='isValueChecked(value, item)'
		>
			<template v-if='$slots.option' #default='props'>
				<slot name='option' v-bind='props' />
			</template>
		</ComboboxOption>
	</Box>
</template>
