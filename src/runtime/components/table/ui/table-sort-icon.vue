<script setup lang="ts" generic="TData extends TableData">
import type { Column, SortDirection } from '@tanstack/vue-table'

import defu from 'defu'
import { computed } from 'vue'

import type { TableData } from '../model'


export interface TableSortIconProps<TData extends TableData> {
	column: Column<TData>
	icons?: Record<SortDirection | 'off', string>
}

const { column, icons } = defineProps<TableSortIconProps<TData>>()

const resolvedIcons = computed(() => defu(icons, {
	asc: 'gravity-ui:bars-descending-align-left-arrow-up',
	desc: 'gravity-ui:bars-descending-align-left-arrow-down',
	off: 'gravity-ui:bars-descending-align-left',
}))

const name = computed(() => column.getIsSorted()
	? column.getIsSorted() === 'asc'
		? resolvedIcons.value.asc
		: resolvedIcons.value.desc
	: resolvedIcons.value.off)
</script>

<template>
	<Icon :name />
</template>
