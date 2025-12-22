import type { RowData, TableMeta } from '@tanstack/table-core'
import type {
	CellContext,
	ColumnDef,
	ColumnFiltersOptions,
	ColumnPinningOptions,
	ColumnSizingOptions,
	CoreOptions,
	ExpandedOptions,
	FacetedOptions,
	GlobalFilterOptions,
	GroupingOptions,
	HeaderContext,
	PaginationOptions,
	Row,
	RowPinningOptions,
	RowSelectionOptions,
	SortingOptions,
	VisibilityOptions,
} from '@tanstack/vue-table'
import type { VirtualizerOptions } from '@tanstack/vue-virtual'
import type { TableHTMLAttributes, WatchOptions } from 'vue'

import type { NuanceColor } from '../../types'


export type TableRow<T> = Row<T>
export type TableData = RowData
export type TableColumn<T extends TableData, D = unknown> = ColumnDef<T, D>

export interface TableOptions<T extends TableData = TableData> extends Omit<CoreOptions<T>, 'data' | 'columns' | 'getCoreRowModel' | 'state' | 'onStateChange' | 'renderFallbackValue'> {
	state?: CoreOptions<T>['state']
	onStateChange?: CoreOptions<T>['onStateChange']
	renderFallbackValue?: CoreOptions<T>['renderFallbackValue']
}


type DynamicHeaderSlots<T, K = keyof T> = Record<string, (props: HeaderContext<T, unknown>) => any>
	& Record<`${K extends string ? K : never}-header`, (props: HeaderContext<T, unknown>) => any>

type DynamicFooterSlots<T, K = keyof T> = Record<string, (props: HeaderContext<T, unknown>) => any>
	& Record<`${K extends string ? K : never}-footer`, (props: HeaderContext<T, unknown>) => any>

type DynamicCellSlots<T, K = keyof T> = Record<string, (props: CellContext<T, unknown>) => any>
	& Record<`${K extends string ? K : never}-cell`, (props: CellContext<T, unknown>) => any>


export type TableSlots<T extends TableData = TableData> = {
	'expanded': (props: { row: Row<T> }) => any
	'empty': (props?: object) => any
	'loading': (props?: object) => any
	'caption': (props?: object) => any
	'body-top': (props?: object) => any
	'body-bottom': (props?: object) => any
} & DynamicHeaderSlots<T> & DynamicFooterSlots<T> & DynamicCellSlots<T>


export interface TableProps<T extends TableData = TableData>
	extends TableOptions<T>, /** @vue-ignore */ Omit<TableHTMLAttributes, 'columns' | 'onSelect' | 'onContextmenu'> {
	data?: T[]
	columns?: TableColumn<T>[]
	caption?: string
	meta?: TableMeta<T>
	/**
	 * Enable virtualization for large datasets.
	 * Note: when enabled, the divider between rows and sticky properties are not supported.
	 * @see https://tanstack.com/virtual/latest/docs/api/virtualizer#options
	 * @defaultValue false
	 */
	virtualize?: boolean | (Partial<Omit<VirtualizerOptions<Element, Element>, 'getScrollElement' | 'count' | 'estimateSize' | 'overscan'>> & {
		/**
		 * Number of items rendered outside the visible area
		 * @defaultValue 12
		 */
		overscan?: number
		/**
		 * Estimated size (in px) of each item, or a function that returns the size for a given index
		 * @defaultValue 65
		 */
		estimateSize?: number | ((index: number) => number)
	})
	/**
	 * The text to display when the table is empty.
	 */
	empty?: string
	/**
	 * Whether the table should have a sticky header or footer. True for both, 'header' for header only, 'footer' for footer only.
	 * Note: this prop is not supported when `virtualize` is true.
	 * @defaultValue false
	 */
	sticky?: boolean | 'header' | 'footer'
	/** Whether the table should be in loading state. */
	loading?: boolean
	/**
	 * @defaultValue 'primary'
	 */
	loadingColor?: NuanceColor | string

	onSelect?: (e: Event, row: TableRow<T>) => void
	onHover?: (e: Event, row: TableRow<T> | null) => void
	onContextmenu?: ((e: Event, row: TableRow<T>) => void) | Array<((e: Event, row: TableRow<T>) => void)>

	classes?: {
		root?: string
		table?: string
		thead?: string
		th?: string
		tr?: string
		tbody?: string
		tfoot?: string
		caption?: string
		loading?: string
		empty?: string
		separator?: string
	}

	/**
	 * Use the `watchOptions` prop to customize reactivity (for ex: disable deep watching for changes in your data or limiting the max traversal depth). This can improve performance by reducing unnecessary re-renders, but it should be used with caution as it may lead to unexpected behavior if not managed properly.
	 * @see [API](https://vuejs.org/api/options-state.html#watch)
	 * @see [Guide](https://vuejs.org/guide/essentials/watchers.html)
	 * @defaultValue { deep: true }
	 */
	watchOptions?: WatchOptions
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/global-filtering#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
	 */
	globalFilterOptions?: Omit<GlobalFilterOptions<T>, 'onGlobalFilterChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/column-filtering#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
	 */
	columnFiltersOptions?: Omit<ColumnFiltersOptions<T>, 'getFilteredRowModel' | 'onColumnFiltersChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/column-pinning#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
	 */
	columnPinningOptions?: Omit<ColumnPinningOptions, 'onColumnPinningChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/column-sizing#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
	 */
	columnSizingOptions?: Omit<ColumnSizingOptions, 'onColumnSizingChange' | 'onColumnSizingInfoChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/column-visibility#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)
	 */
	visibilityOptions?: Omit<VisibilityOptions, 'onColumnVisibilityChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/sorting#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
	 */
	sortingOptions?: Omit<SortingOptions<T>, 'getSortedRowModel' | 'onSortingChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/grouping#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
	 */
	groupingOptions?: Omit<GroupingOptions, 'onGroupingChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/expanding#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
	 */
	expandedOptions?: Omit<ExpandedOptions<T>, 'getExpandedRowModel' | 'onExpandedChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/row-selection#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
	 */
	rowSelectionOptions?: Omit<RowSelectionOptions<T>, 'onRowSelectionChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/row-pinning#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
	 */
	rowPinningOptions?: Omit<RowPinningOptions<T>, 'onRowPinningChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/pagination#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
	 */
	paginationOptions?: Omit<PaginationOptions, 'onPaginationChange'>
	/**
	 * @see [API](https://tanstack.com/table/v8/docs/api/features/column-faceting#table-options)
	 * @see [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
	 */
	facetedOptions?: FacetedOptions<T>
}
