import type { TreeFilter, TreeItem } from '../model'


export function filterTreeItems(items: TreeItem[] | undefined, filter?: TreeFilter) {
	if (!filter || !items)
		return items

	if (typeof filter === 'string')
		return items.filter(i => i.type === filter)

	return items.filter(filter)
}
