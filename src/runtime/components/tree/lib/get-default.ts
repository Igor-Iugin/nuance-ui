import type { TreeItem } from '../model'


/**
 * Получает все элементы дерева с expanded: true
 * @param items - массив элементов дерева
 * @returns массив value элементов с expanded: true
 */
export function getExpandedItems<T extends string = string>(items: TreeItem<T>[]) {
	const result: T[] = []

	for (const item of items) {
		if (item.expanded === true)
			result.push(item.value)

		if (item.children && item.children.length > 0)
			result.push(...getExpandedItems<T>(item.children))
	}

	return result
}
