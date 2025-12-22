import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'

import type { TableColumn, TableData } from './model'


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
