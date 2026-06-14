<script setup lang="ts" generic="TData extends TableData">
import type { Column, SortDirection } from '@tanstack/vue-table'

import { useConfig } from '@nui/composables'
import defu from 'defu'
import { computed } from 'vue'

import type { TableData } from '../types'


export interface TableSortIconProps<TData extends TableData> {
	column: Column<TData>
	icons?: Record<SortDirection | 'off', string>
}

const { column, icons } = defineProps<TableSortIconProps<TData>>()

const cfg = useConfig()
const resolvedIcons = computed(() => defu(icons, {
	asc: cfg.icons.sortAsc,
	desc: cfg.icons.sortDesc,
	off: cfg.icons.sortOff,
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
