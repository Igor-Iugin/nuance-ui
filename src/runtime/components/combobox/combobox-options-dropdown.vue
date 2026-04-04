<script setup lang='ts' generic='Value extends string = string, Ext extends ComboboxItemExt = object'>
import { computed } from 'vue'

import type { FilterOptionsInput } from './lib/utils'
import type { ComboboxItemExt, ComboboxOption } from './types'

import ComboboxDropdown from './combobox-dropdown.vue'
import ComboboxEmpty from './combobox-empty.vue'
import ComboboxGroup from './combobox-group.vue'
import ComboboxOptionList from './combobox-option-list.vue'
import ComboboxOptions from './combobox-option.vue'
import { defaultOptionsFilter, isEmptyComboboxData, isOptionsGroup, isValueChecked } from './lib/utils'


export interface ComboboxOptionsDropdownProps<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> {
	data: ComboboxOption<Value, Ext>[]

	filter?: (input: FilterOptionsInput<Value, Ext>) => ComboboxOption<Value, Ext>[]
	limit?: number
	maxDropdownHeight?: number | string
	filterOptions?: boolean
	nothingFoundMessage?: string
	labelId: string | undefined

	withCheckIcon?: boolean
	iconPosition?: 'left' | 'right'
	checkIcon?: string
}

const {
	data,
	labelId,
	nothingFoundMessage = 'Нет вариантов',
	withCheckIcon = true,
	filterOptions = true,
	iconPosition,
	checkIcon,
	filter,
	limit,
} = defineProps<ComboboxOptionsDropdownProps<Value, Ext>>()

const search = defineModel<string | undefined>('search')
const value = defineModel<string | string[] | null>()

const isEmpty = computed(() => isEmptyComboboxData(data))
const filteredData = computed(() => typeof search.value === 'string'
	? (filter || defaultOptionsFilter)({
		options: data,
		search: filterOptions ? search.value : '',
		limit: limit ?? Infinity,
	})
	: data)
</script>

<template>
	<ComboboxDropdown data-composed>
		<ComboboxOptionList :labelled-by='labelId' v-bind='$attrs'>
			<template
				v-for='item in filteredData'
				:key='isOptionsGroup(item) ? item.group : item?.value'
			>
				<ComboboxGroup
					v-if='isOptionsGroup(item)'
					v-model:value='value'
					:label='item.group'
					:data='item'
					:with-check-icon
					:icon-position
					:check-icon
				/>
				<ComboboxOptions
					v-else
					:data='item'
					:with-check-icon
					:icon-position
					:check-icon
					:checked='isValueChecked(value, item.value)'
				/>
			</template>
			<ComboboxEmpty v-if='isEmpty'>
				{{ nothingFoundMessage }}
			</ComboboxEmpty>
		</ComboboxOptionList>
	</ComboboxDropdown>
</template>
