import type { NuanceColor } from '@nui/types'
import type { Ref } from 'vue'


export interface TreeModels {
	active: string | null
	tree: TreeItem[]
	selected: string[]
	expanded: string[]
}

export interface TreeEmits {
	delete: [path: string[]]
}

export interface TreeLoaderResult {
	data: Ref<TreeItem[] | undefined>
	pending: Ref<boolean>
	execute: () => Promise<unknown>
}

/**
 *  Returns an object with `data`, `pending`, and `execute` fields.
 *  Root path will be queried immediately with path `/`.
 *
 *  @example Nuxt
 *  ```ts
 *  const loadBranch = (path: string) => useAsyncData(path, () => $fetch(`/api/tree${path}`), { immediate: false })
 *  ```
 *
 *  @example vue-query
 *  ```ts
 *  const loadBranch = (path: string) => {
 *    const { data, isPending, refetch } = useQuery({ queryKey: ['tree', path], queryFn: () => fetchTree(path) })
 *    return { data, pending: isPending, execute: refetch }
 *  }
 *  ```
 */
export type TreeLoader = (path: string) => TreeLoaderResult

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

export type TreeFilter = 'directory' | null | ((item: TreeItem) => boolean)
