import type { Cell, Header, Row, RowData } from '@tanstack/vue-table'


declare module '@tanstack/table-core' {
	interface ColumnMeta<TData extends RowData, TValue> {
		class?: {
			th?: string | ((cell: Header<TData, TValue>) => string)
			td?: string | ((cell: Cell<TData, TValue>) => string)
		}
		style?: {
			th?: string | Record<string, string> | ((cell: Header<TData, TValue>) => string | Record<string, string>)
			td?: string | Record<string, string> | ((cell: Cell<TData, TValue>) => string | Record<string, string>)
		}
		colspan?: {
			td?: number | ((cell: Cell<TData, TValue>) => number)
		}
		rowspan?: {
			td?: number | ((cell: Cell<TData, TValue>) => number)
		}
	}

	interface TableMeta<TData extends RowData> {
		class?: {
			tr?: string | ((row: Row<TData>) => string)
		}
		style?: {
			tr?: string | Record<string, string> | ((row: Row<TData>) => string | Record<string, string>)
		}
	}
}
