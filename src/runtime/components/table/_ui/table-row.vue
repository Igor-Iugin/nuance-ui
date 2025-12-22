<script setup lang="ts" generic='T extends TableData'>
import type { Row } from '@tanstack/vue-table'

import { FlexRender } from '@tanstack/vue-table'

import type { TableData, TableRow } from '../model'

import Box from '../../box.vue'
import { resolveValue } from '../lib'


export interface TableRowProps<T extends TableData> {
	row: Row<T>
	onSelect?: (e: Event, row: TableRow<T>) => void
	onHover?: (e: Event, row: TableRow<T> | null) => void
	onContextmenu?: ((e: Event, row: TableRow<T>) => void) | Array<((e: Event, row: TableRow<T>) => void)>
}
const { row, onSelect, onHover, onContextmenu } = defineProps<TableRowProps<T>>()


function onRowSelect(e: Event, row: TableRow<T>) {
	if (!onSelect)
		return

	const target = e.target as HTMLElement
	const isInteractive = target.closest('button') || target.closest('a')
	if (isInteractive)
		return

	e.preventDefault()
	e.stopPropagation()

	onSelect(e, row)
}

function onRowHover(e: Event, row: TableRow<T> | null) {
	if (!onHover)
		return

	onHover(e, row)
}

function onRowContextmenu(e: Event, row: TableRow<T>) {
	if (!onContextmenu)
		return

	if (Array.isArray(onContextmenu))
		onContextmenu.forEach(fn => fn(e, row))
	else
		onContextmenu(e, row)
}
</script>

<template>
	<Box
		is='tr'
		v-bind='$attrs'
		:mod='{
			selected: row.getIsSelected(),
			expanded: row.getIsExpanded(),
			selectable: !!onSelect || !!onHover || !!onContextmenu,
		}'
		:role="onSelect ? 'button' : undefined"
		:tabindex='onSelect ? 0 : undefined'
		@click='onRowSelect($event, row)'
		@pointerenter='onRowHover($event, row)'
		@pointerleave='onRowHover($event, null)'
		@contextmenu='onRowContextmenu($event, row)'
	>
		<Box
			is='td'
			v-for='cell in row.getVisibleCells()'
			:key='cell.id'
			:mod='{ pinned: cell.column.getIsPinned() }'
			:colspan='resolveValue(cell.column.columnDef.meta?.colspan?.td, cell)'
			:rowspan='resolveValue(cell.column.columnDef.meta?.rowspan?.td, cell)'
			:class='resolveValue(cell.column.columnDef.meta?.class?.td, cell)'
			:style='[
				{ width: cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : undefined },
				resolveValue(cell.column.columnDef.meta?.style?.td, cell),
			]'
		>
			<slot :name='`${cell.column.id}-cell`' v-bind='cell.getContext()'>
				<FlexRender :render='cell.column.columnDef.cell' :props='cell.getContext()' />
			</slot>
		</Box>
	</Box>

	<tr v-if='row.getIsExpanded()'>
		<td :colspan='row.getAllCells().length'>
			<slot name='expanded' :row='row' />
		</td>
	</tr>
</template>
