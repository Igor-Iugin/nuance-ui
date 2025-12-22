<script setup lang="ts" generic="T extends TableData">
import type {
	ColumnFiltersState,
	ColumnOrderState,
	ColumnPinningState,
	ColumnSizingInfoState,
	ColumnSizingState,
	ExpandedState,
	GroupingState,
	PaginationState,
	RowPinningState,
	RowSelectionState,
	SortingState,
	VisibilityState,
} from '@tanstack/vue-table'
import type { Ref } from 'vue'

import {
	FlexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useVueTable,
} from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { reactivePick, unrefElement } from '@vueuse/core'
import { useStyleResolver } from '#imports'
import defu from 'defu'
import { computed, ref, toRef, useTemplateRef, watch } from 'vue'

import type { TableColumn, TableData, TableProps, TableSlots } from './model'

import { getThemeColor } from '../../utils'
import Box from '../box.vue'
import TableRow from './_ui/table-row.vue'
import { processColumns, resolveValue, valueUpdater } from './lib'


defineOptions({ inheritAttrs: false })
const props = defineProps<TableProps<T>>()

defineSlots<TableSlots<T>>()

const data = ref(props.data ?? []) as Ref<T[]>
const meta = computed(() => props?.meta ?? {})
const columns = computed<TableColumn<T>[]>(() => processColumns(props.columns ?? Object.keys(data.value[0] ?? {})
	.map((accessorKey: string) => ({ accessorKey, header: accessorKey }))))

const hasFooter = computed(() => {
	function hasFooterRecursive(columns: TableColumn<T>[]): boolean {
		for (const column of columns) {
			if ('footer' in column)
				return true
			if ('columns' in column && hasFooterRecursive(column.columns as TableColumn<T>[]))
				return true
		}

		return false
	}

	return hasFooterRecursive(columns.value)
})


const globalFilterState = defineModel<string>('globalFilter')
const columnFiltersState = defineModel<ColumnFiltersState>('columnFilters')
const columnOrderState = defineModel<ColumnOrderState>('columnOrder')
const columnVisibilityState = defineModel<VisibilityState>('columnVisibility')
const columnPinningState = defineModel<ColumnPinningState>('columnPinning')
const columnSizingState = defineModel<ColumnSizingState>('columnSizing')
const columnSizingInfoState = defineModel<ColumnSizingInfoState>('columnSizingInfo')
const rowSelectionState = defineModel<RowSelectionState>('rowSelection')
const rowPinningState = defineModel<RowPinningState>('rowPinning')
const sortingState = defineModel<SortingState>('sorting')
const groupingState = defineModel<GroupingState>('grouping')
const expandedState = defineModel<ExpandedState>('expanded')
const paginationState = defineModel<PaginationState>('pagination')


const tableProps = reactivePick(props, '_features', 'autoResetAll', 'debugAll', 'debugCells', 'debugColumns', 'debugHeaders', 'debugRows', 'debugTable', 'defaultColumn', 'getRowId', 'getSubRows', 'initialState', 'mergeOptions', 'renderFallbackValue')

const rootRef = useTemplateRef<HTMLElement>('rootRef')
const tableRef = useTemplateRef<HTMLTableElement>('tableRef')

const table = useVueTable({
	...tableProps,
	get data() {
		return data.value
	},
	get columns() {
		return columns.value
	},
	meta: meta.value,
	getCoreRowModel: getCoreRowModel(),
	...(props.globalFilterOptions || {}),
	...(globalFilterState.value !== undefined && {
		onGlobalFilterChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, globalFilterState),
	}),
	...(props.columnFiltersOptions || {}),
	getFilteredRowModel: getFilteredRowModel(),
	...(columnFiltersState.value !== undefined && {
		onColumnFiltersChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnFiltersState),
	}),
	...(columnOrderState.value !== undefined && {
		onColumnOrderChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnOrderState),
	}),
	...(props.visibilityOptions || {}),
	...(columnVisibilityState.value !== undefined && {
		onColumnVisibilityChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnVisibilityState),
	}),
	...(props.columnPinningOptions || {}),
	...(columnPinningState.value !== undefined && {
		onColumnPinningChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnPinningState),
	}),
	...(props.columnSizingOptions || {}),
	...(columnSizingState.value !== undefined && {
		onColumnSizingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnSizingState),
	}),
	...(columnSizingInfoState.value !== undefined && {
		onColumnSizingInfoChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, columnSizingInfoState),
	}),
	...(props.rowSelectionOptions || {}),
	...(rowSelectionState.value !== undefined && {
		onRowSelectionChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, rowSelectionState),
	}),
	...(props.rowPinningOptions || {}),
	...(rowPinningState.value !== undefined && {
		onRowPinningChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, rowPinningState),
	}),
	...(props.sortingOptions || {}),
	getSortedRowModel: getSortedRowModel(),
	...(sortingState.value !== undefined && {
		onSortingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, sortingState),
	}),
	...(props.groupingOptions || {}),
	...(groupingState.value !== undefined && {
		onGroupingChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, groupingState),
	}),
	...(props.expandedOptions || {}),
	getExpandedRowModel: getExpandedRowModel(),
	...(expandedState.value !== undefined && {
		onExpandedChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, expandedState),
	}),
	...(props.paginationOptions || {}),
	...(paginationState.value !== undefined && {
		onPaginationChange: (updaterOrValue: any) => valueUpdater(updaterOrValue, paginationState),
	}),
	...(props.facetedOptions || {}),
	state: {
		get globalFilter() {
			return globalFilterState.value
		},
		get columnFilters() {
			return columnFiltersState.value
		},
		get columnOrder() {
			return columnOrderState.value
		},
		get columnVisibility() {
			return columnVisibilityState.value
		},
		get columnPinning() {
			return columnPinningState.value
		},
		get expanded() {
			return expandedState.value
		},
		get rowSelection() {
			return rowSelectionState.value
		},
		get sorting() {
			return sortingState.value
		},
		get grouping() {
			return groupingState.value
		},
		get rowPinning() {
			return rowPinningState.value
		},
		get columnSizing() {
			return columnSizingState.value
		},
		get columnSizingInfo() {
			return columnSizingInfoState.value
		},
		get pagination() {
			return paginationState.value
		},
	},
})


const rows = computed(() => table.getRowModel().rows)
watch(() => props.data, () => {
	data.value = props.data ? [...props.data] : []
}, props.watchOptions)


const virtualizerProps = toRef(() => defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
	estimateSize: 65,
	overscan: 12,
}))

const virtualizer = !!props.virtualize && useVirtualizer({
	...virtualizerProps.value,
	get count() {
		return rows.value.length
	},
	getScrollElement: () => unrefElement(rootRef) as Element,
	estimateSize: (index: number) => {
		const estimate = virtualizerProps.value.estimateSize
		return typeof estimate === 'function' ? estimate(index) : estimate
	},
})

const renderedSize = computed(() => {
	if (!virtualizer)
		return 0

	const virtualItems = virtualizer.value.getVirtualItems()
	if (!virtualItems?.length)
		return 0

	// Sum up the actual sizes of virtual items
	return virtualItems.reduce((sum: number, item: any) => sum + item.size, 0)
})

const style = computed(() => useStyleResolver(theme => ({
	'--table-loader-color': props.loadingColor ? getThemeColor(props.loadingColor, theme) : undefined,
	'--vertical-align': props.verticalAlign,
})))

defineExpose({
	get $el() {
		return unrefElement(rootRef) as HTMLElement
	},
	tableRef,
	table,
})
</script>

<template>
	<Box
		ref='rootRef'
		:class='[$style.root, props.classes?.root]'
		:style='[
			virtualizer ? { height: `${virtualizer.getTotalSize()}px` } : undefined,
			style,
		]'
		:mod='{ virtualize: !!virtualizer }'
	>
		<table ref='tableRef' :class='[$style.table, props.classes?.table]'>
			<caption v-if='caption || $slots.caption' :class='props.classes?.caption'>
				<slot name='caption'>
					{{ props.caption }}
				</slot>
			</caption>

			<Box
				is='thead'
				:class='$style.thead'
				:mod='{
					sticky: props.sticky === "header" || props.sticky === true,
					loading: props.loading,
				}'
			>
				<tr v-for='headerGroup in table.getHeaderGroups()' :key='headerGroup.id' :class='$style.tr'>
					<Box
						is='th'
						v-for='header in headerGroup.headers'
						:key='header.id'
						:mod='{ pinned: header.column.getIsPinned() }'
						:scope="header.colSpan > 1 ? 'colgroup' : 'col'"
						:colspan='header.colSpan > 1 ? header.colSpan : undefined'
						:rowspan='header.rowSpan > 1 ? header.rowSpan : undefined'
						:class='[$style.th, props.classes?.th, resolveValue(header.column.columnDef.meta?.class?.th, header)]'
						:style='resolveValue(header.column.columnDef.meta?.style?.th, header)'
					>
						<slot :name='`${header.id}-header`' v-bind='header.getContext()'>
							<FlexRender
								v-if='!header.isPlaceholder'
								:render='header.column.columnDef.header'
								:props='header.getContext()'
							/>
						</slot>
					</Box>
				</tr>

				<tr :class='[$style.separator, props.classes?.separator]' />
			</Box>

			<tbody :class='[$style.tbody, props.classes?.tbody]'>
				<slot name='body-top' />

				<template v-if='rows.length'>
					<template v-if='virtualizer'>
						<template v-for='(virtualRow, index) in virtualizer.getVirtualItems()' :key='rows[virtualRow.index]?.id'>
							<TableRow
								:row='rows[virtualRow.index]!'
								:class='[$style.tr, props.classes?.tr, resolveValue(table.options.meta?.class?.tr, virtualRow)]'
								:style='[
									{
										height: `${virtualRow.size}px`,
										transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
									},
									resolveValue(table.options.meta?.style?.tr, virtualRow),
								]'
								:on-select='props?.onSelect'
								:on-hover='props?.onHover'
								:on-contextmenu='props?.onContextmenu'
							/>
						</template>
					</template>

					<template v-else>
						<TableRow
							v-for='row in rows'
							:key='row.id'
							:row='row'
							:class='[$style.tr, props.classes?.tr, resolveValue(table.options.meta?.class?.tr, row)]'
							:style='resolveValue(table.options.meta?.style?.tr, row)'
							:on-select='props?.onSelect'
							:on-hover='props?.onHover'
							:on-contextmenu='props?.onContextmenu'
						/>
					</template>
				</template>

				<tr v-else-if='loading && !!$slots.loading'>
					<td :colspan='table.getAllLeafColumns().length' :class='[$style.loading, props.classes?.loading]'>
						<slot name='loading' />
					</td>
				</tr>

				<tr v-else>
					<td :colspan='table.getAllLeafColumns().length' :class='[$style.empty, props.classes?.empty]'>
						<slot name='empty'>
							{{ empty || 'Нет данных' }}
						</slot>
					</td>
				</tr>

				<slot name='body-bottom' />
			</tbody>

			<Box
				is='tfoot'
				v-if='hasFooter'
				:class='[$style.tfoot, props.classes?.tfoot]'
				:style='virtualizer ? { transform: `translateY(${virtualizer.getTotalSize() - renderedSize}px)` } : undefined'
				:mod='{ sticky: props.sticky === "footer" || props.sticky === true }'
			>
				<tr :class='[$style.separator, props.classes?.separator]' />

				<tr v-for='footerGroup in table.getFooterGroups()' :key='footerGroup.id' :class='[$style.tr, props.classes?.tr]'>
					<Box
						is='th'
						v-for='header in footerGroup.headers'
						:key='header.id'
						:mod='{ pinned: header.column.getIsPinned() }'
						:colspan='header.colSpan > 1 ? header.colSpan : undefined'
						:rowspan='header.rowSpan > 1 ? header.rowSpan : undefined'
						:class='[$style.th, props.classes?.th, resolveValue(header.column.columnDef.meta?.class?.th, header)]'
						:style='resolveValue(header.column.columnDef.meta?.style?.th, header)'
					>
						<slot :name='`${header.id}-footer`' v-bind='header.getContext()'>
							<FlexRender
								v-if='!header.isPlaceholder'
								:render='header.column.columnDef.footer'
								:props='header.getContext()'
							/>
						</slot>
					</Box>
				</tr>
			</Box>
		</table>
	</Box>
</template>

<style lang="postcss" module>
.root {
	--table-color: var(--color-primary-4);
	--table-loader-color: var(--table-color);
	--table-loader-animation: carousel 2s ease-in-out infinite;
	--table-padding-x: .5rem;
	--table-padding-y: .5rem;
	--vertical-align: baseline;

	@mixin where-light {
		--table-active-bg: alpha(var(--color-slate-1), .5);
		--table-c: var(--color-slate-7);
		--table-bd-color: var(--color-slate-3);
	}

	@mixin where-dark {
		--table-active-bg: alpha(var(--color-slate-7), .5);
		--table-c: var(--color-slate-4);
		--table-bd-color: var(--color-slate-7);
	}

	position: relative;
	overflow: auto;

	&:not([data-virtualize]) {
		.table {
			overflow: clip;
		}

		.tbody > tr:not(:last-of-type) {
			border-bottom: 1px solid var(--table-bd-color);
		}
	}
}

.table {
	min-width: 100%;
	border-collapse: collapse;
}

.thead {
	position: relative;

	&[data-loading]::after {
		content: '';
		position: absolute;
		z-index: 1;
		height: 1px;
		background-color: alpha(var(--table-loader-color), .75);
		animation: var(--table-loader-animation);
	}

	&[data-sticky] {
		position: sticky;
		top: 0;
		inset-inline: 0rem;
		z-index: 1;

		background-color: alpha(var(--color-body), .75);
		backdrop-filter: blur(8px);
	}
}

.th {
	font-weight: 600;
	padding-block: var(--table-padding-y);
	padding-inline: var(--table-padding-x);
	text-align: left;
	color: var(--table-c);
	vertical-align: var(--vertical-align);

	&:has([role='checkbox']) {
		padding-inline-end: 0;
	}
}

.th[data-pinned],
.tr td[data-pinned] {
	position: sticky;
	z-index: 1;
	background-color: alpha(var(--color-body), .75);
}

.tbody {
	isolation: isolate;
}

.tfoot {
	position: relative;

	&[data-sticky] {
		position: sticky;
		bottom: 0;
		inset-inline: 0rem;
		z-index: 1;

		background-color: var(--color-body);
		backdrop-filter: blur(8px);
	}
}

.tr {
	&[data-selectable] {
		&:hover {
			background-color: var(--table-active-bg);
		}
		&:focus-visible {
			outline: 1px solid var(--table-color);
		}
	}

	&[data-selected] {
		background-color: var(--table-active-bg);
	}

	td {
		white-space: nowrap;
		padding-block: var(--table-padding-y);
		padding-inline: var(--table-padding-x);
		color: var(--table-c);
		vertical-align: var(--vertical-align);

		&:has([role='checkbox']) {
			padding-inline-end: 0;
		}
	}
}

.separator {
	position: absolute;
	z-index: 1;
	left: 0;
	width: 100%;
	height: 1px;
	background-color: var(--table-bd-color);
}

.loading,
.empty {
	padding-inline: 1.5rem;
	text-align: center;
}

@keyframes carousel {
	0%, to{
		width:50%
	}
	0%{
		transform:translate(-100%)
	}
	to{
		transform:translate(200%)
	}
}
</style>
