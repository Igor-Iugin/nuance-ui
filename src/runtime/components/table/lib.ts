import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'

import type { TableColumn, TableData, TableProps, TableRow } from './model'


export function processColumns<T extends TableData>(columns: TableColumn<T>[]): TableColumn<T>[] {
	return columns.map(column => {
		const col = { ...column } as TableColumn<T>

		if ('columns' in col && col.columns)
			col.columns = processColumns(col.columns as TableColumn<T>[])

		if (!col.cell) {
			col.cell = ({ getValue }) => {
				const value = getValue()
				if (value === '' || value === null || value === undefined)
					return '\u00A0'

				return String(value)
			}
		}

		return col
	})
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
	ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

export function resolveValue<T, A = undefined>(prop: T | ((arg: A) => T), arg?: A): T | undefined {
	if (typeof prop === 'function')
		// @ts-expect-error: TS can't know if prop is a function here
		return prop(arg)

	return prop
}


export function createRowHandlers<T extends TableData>(props: TableProps<T>) {
	function onRowSelect(e: Event, row: TableRow<T>) {
		if (!props?.onSelect)
			return

		const target = e.target as HTMLElement
		const isInteractive = target.closest('button') || target.closest('a')
		if (isInteractive)
			return

		e.preventDefault()
		e.stopPropagation()

		props.onSelect(e, row)
	}

	function onRowHover(e: Event, row: TableRow<T> | null) {
		if (!props?.onHover)
			return

		props.onHover(e, row)
	}

	function onRowContextmenu(e: Event, row: TableRow<T>) {
		if (!props?.onContextmenu)
			return

		if (Array.isArray(props.onContextmenu))
			props.onContextmenu.forEach(fn => fn(e, row))
		else
			props.onContextmenu(e, row)
	}

	return {
		onRowSelect,
		onRowHover,
		onRowContextmenu,
	}
}
