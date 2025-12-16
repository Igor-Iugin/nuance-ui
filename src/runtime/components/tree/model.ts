import type { NuanceColor } from '@nui/types'
import type { AsyncData } from '#app'
import type { FetchError } from 'ofetch'


export interface TreeModels {
	active: string | null
	tree: TreeItem[]
	selected: string[]
	expanded: string[]
}

export interface TreeEmits {
	delete: [path: string[]]
}

/**
 *  Required pass instance of `useFetch`/`useAsyncData` with `{ immediate: false }`
 *  Root path will be queried immediate with path `/`
 */
export type TreeLoader = (path: string) => AsyncData<TreeItem[], FetchError<any>>
export type TreeItemType = 'file' | 'directory'

export interface TreeItem {
	/** @IconifyIcon */
	icon?: string
	/** Path given to this item */
	path: string
	/** Item name */
	name?: string
	/** @IconifyIcon */
	trailingIcon?: string
	/** Item disabled state */
	disabled?: boolean
	/**
	 *  Type of item
	 *  @default `file`
	 */
	type?: TreeItemType

	children?: TreeItem[]
}

export type TreeIconResolver = (type: TreeItemType, name?: string, path?: string, disabled?: boolean) => {
	icon: string
	color?: NuanceColor
}
