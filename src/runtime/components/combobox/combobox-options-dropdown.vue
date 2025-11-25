<script setup lang='ts' generic='Value extends string = string, Ext extends ComboboxItemExt = object'>
import { computed } from 'vue'

import type { FilterOptionsInput } from './lib/utils'
import { defaultOptionsFilter, isEmptyComboboxData, isOptionsGroup, isValueChecked } from './lib/utils'
import type { ComboboxItem, ComboboxItemExt, ComboboxParsedItem } from './model'

import ComboboxDropdown from './combobox-dropdown.vue'
import ComboboxEmpty from './combobox-empty.vue'
import ComboboxGroup from './combobox-group.vue'
import ComboboxOptionList from './combobox-option-list.vue'
import ComboboxOption from './combobox-option.vue'


export interface ComboboxOptionsDropdownProps<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> {
	data: ComboboxParsedItem<Value, Ext>[]

	filter?: (input: FilterOptionsInput<Value, Ext>) => ComboboxParsedItem<Value, Ext>[]
	limit?: number
	withScrollArea?: boolean
	maxDropdownHeight?: number | string
	hiddenWhenEmpty?: boolean
	filterOptions?: boolean
	nothingFoundMessage?: string
	labelId: string | undefined
	ariaLabel: string | undefined

	withCheckIcon?: boolean
	iconPosition?: 'left' | 'right'
	checkIcon?: string
}

const {
	data,
	labelId,
	ariaLabel,
	nothingFoundMessage = 'Нет вариантов',
	withCheckIcon = true,
	filterOptions = true,
	iconPosition,
	checkIcon,
	filter,
	limit,
} = defineProps<ComboboxOptionsDropdownProps<Value, Ext>>()

const search = defineModel<string | undefined>('search')
const value = defineModel<ComboboxItem<Value, Ext> | ComboboxItem<Value, Ext>[] | null>()

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
		<ComboboxOptionList :labelled-by='labelId' :aria-label='ariaLabel'>
			<template
				v-for='item in filteredData'
				:key='isOptionsGroup(item) ? item.group : (item as ComboboxItem<Value, Ext>)?.value'
			>
				<ComboboxGroup
					v-if='isOptionsGroup(item)'
					v-model:value='value'
					:data='item'
					:with-check-icon
					:icon-position
					:check-icon
				/>
				<ComboboxOption
					v-else
					:data='item'
					:with-check-icon
					:icon-position
					:check-icon
					:checked='isValueChecked(value, item)'
				/>
			</template>
			<ComboboxEmpty v-if='isEmpty'>
				{{ nothingFoundMessage }}
			</ComboboxEmpty>
		</ComboboxOptionList>
	</ComboboxDropdown>
</template>
