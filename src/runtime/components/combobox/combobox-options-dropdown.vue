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
	/** List of options to render */
	data: ComboboxOption<Value, Ext>[]

	/** Custom filter function applied to the options list */
	filter?: (input: FilterOptionsInput<Value, Ext>) => ComboboxOption<Value, Ext>[]
	/** Maximum number of options to display */
	limit?: number
	/** Maximum height of the dropdown */
	maxDropdownHeight?: number | string
	/** Filters options by the current search value */
	filterOptions?: boolean
	/** Text shown when no options match the search */
	nothingFoundMessage?: string
	/** Id of the element that labels the options list */
	labelId: string | undefined

	/** Shows a check icon next to the selected option */
	withCheckIcon?: boolean
	/** Position of the check icon relative to the label */
	iconPosition?: 'left' | 'right'
	/** Icon name for the check mark */
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
	<ComboboxDropdown>
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
