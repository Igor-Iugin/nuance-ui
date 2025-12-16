/** Represents a tree node with a value and optional children. */
export interface TreeNode<T extends string = string> {
	/** The value stored in this tree node */
	path: string
	/** Optional array of child nodes */
	children?: TreeNode<T>[]
}

/**
 * Recursively traverses a tree and collects all nodes in depth-first order.
 * @template T - The type of node values
 * @param {TreeNode<T>[]} nodes - The array of tree nodes to traverse
 * @returns {TreeNode<T>[]} Flattened array containing all nodes
 * @example
 * const tree = [{ value: 'a', children: [{ value: 'b' }] }]
 * traverse(tree) // [{ value: 'a', children: [...] }, { value: 'b' }]
 */
function traverse<T extends string = string>(nodes: TreeNode<T>[]): TreeNode<T>[] {
	const result: TreeNode<T>[] = []

	for (const node of nodes) {
		result.push(node)
		if (node.children?.length)
			result.push(...traverse(node.children))
	}

	return result
}

/**
 * Filters tree nodes based on a predicate function.
 * Returns a new tree containing only nodes that match the predicate.
 * Parent nodes are kept if they have matching children.
 *
 * @template Node - The type of tree nodes
 * @param {Node[]} tree - The tree to filter
 * @param {(node: Node) => boolean} predicate - Function to test each node
 * @returns {Node[]} New filtered tree
 * @example
 * const tree = [
 *   { value: 'folder', children: [{ value: 'file1' }, { value: 'file2' }] },
 *   { value: 'file3' }
 * ]
 * // Keep only folders (nodes with children)
 * filterTree(tree, node => node.children && node.children.length > 0)
 * // Result: [{ value: 'folder', children: [{ value: 'file1' }, { value: 'file2' }] }]
 */
export function filterTree<Node extends TreeNode = TreeNode>(
	tree: Node[],
	predicate: (node: Node) => boolean,
): Node[] {
	const result: Node[] = []

	for (const node of tree) {
		// Рекурсивно фильтруем детей
		const filteredChildren = node.children?.length
			? filterTree(node.children as Node[], predicate)
			: undefined

		// Оставляем узел если:
		// 1. Он соответствует предикату
		// 2. ИЛИ у него есть отфильтрованные дети
		if (predicate(node) || (filteredChildren && filteredChildren.length > 0)) {
			const newNode: Node = { ...node }
			if (filteredChildren && filteredChildren.length > 0)
				newNode.children = filteredChildren
			else
				// Удаляем пустой массив children
				delete newNode.children

			result.push(newNode)
		}
	}

	return result
}

/**
 * Searches for a tree item by its value using depth-first search.
 * @template T - The type of node values
 * @param {TreeNode<T>[]} items - The array of tree nodes to search in
 * @param {T} path - The value to search for
 * @returns {TreeNode<T> | null} The found node or null if not found
 * @example
 * const tree = [{ value: 'folder', children: [{ value: 'file' }] }]
 * findTreeItem(tree, 'file') // { value: 'file' }
 * findTreeItem(tree, 'missing') // null
 */
export function findTreeItem<T extends string = string>(
	items: TreeNode<T>[],
	path: T,
): TreeNode<T> | null {
	for (const item of items) {
		if (item.path === path)
			return item
		if (item.children?.length) {
			const found = findTreeItem(item.children, path)
			if (found)
				return found
		}
	}

	return null
}

/**
 * Flattens a tree structure into a single-level array in depth-first order.
 * @template T - The type of node values
 * @param {TreeNode<T>[]} tree - The tree to flatten
 * @returns {TreeNode<T>[]} Flattened array containing all nodes
 * @example
 * const tree = [
 *   { value: 'root', children: [
 *     { value: 'child1' },
 *     { value: 'child2' }
 *   ]}
 * ]
 * flatTree(tree) // [{ value: 'root', ... }, { value: 'child1' }, { value: 'child2' }]
 */
export function flatTree<T extends string = string>(tree: TreeNode<T>[]): TreeNode<T>[] {
	return traverse(tree)
}

/**
 * Gets all descendant values of a specific node in the tree.
 *
 * @template T - The type of node values
 * @param {TreeNode<T>[]} tree - The tree to search in
 * @param {T} value - The value of the parent node
 * @returns {T[]} Array of all descendant values (empty if node not found or has no children)
 * @example
 * const tree = [
 *   { value: 'folder', children: [
 *     { value: 'file1' },
 *     { value: 'subfolder', children: [{ value: 'file2' }] }
 *   ]}
 * ]
 * getBranchChildren(tree, 'folder') // ['file1', 'subfolder', 'file2']
 * getBranchChildren(tree, 'file1') // []
 */
export function getBranchChildren<T extends string = string>(
	tree: TreeNode<T>[],
	path: T,
): T[] {
	const children: T[] = []

	/** Recursively searches for the target node and extracts its children. */
	function findAndExtract(nodes: TreeNode<T>[]): boolean {
		for (const node of nodes) {
			if (node.path === path) {
				// Found the target node - extract all descendants
				if (node.children?.length) {
					const extracted = traverse<T>(node.children)
					children.push(...extracted.map(i => i.path as T))
				}
				return true
			}

			if (node.children?.length && findAndExtract(node.children))
				return true
		}

		return false
	}

	findAndExtract(tree)
	return children
}

/**
 * Gets all node values between two specified values (inclusive) in tree traversal order.
 * If start comes after end in traversal order, the range is automatically reversed.
 * Uses a single-pass algorithm that flattens and searches simultaneously.
 * @template T - The type of node values
 * @param {TreeNode<T>[]} tree - The tree to search in
 * @param {T} start - The starting value
 * @param {T} end - The ending value
 * @returns {T[]} Array of values between start and end (inclusive), empty if either value not found
 * @example
 * const tree = [
 *   { value: 'a', children: [{ value: 'b' }, { value: 'c' }] },
 *   { value: 'd' }
 * ]
 * getItemsBetween(tree, 'b', 'd') // ['b', 'c', 'd']
 * getItemsBetween(tree, 'd', 'b') // ['b', 'c', 'd'] (auto-reversed)
 * getItemsBetween(tree, 'a', 'missing') // []
 */
export function getTreeItemsBetween<T extends string = string>(
	tree: TreeNode<T>[],
	start: T,
	end: T,
): T[] {
	const result: T[] = []
	let startIdx = -1
	let endIdx = -1
	let currentIdx = 0

	/** Traverses the tree while tracking indices and building flat list. */
	function traverseAndFind(nodes: TreeNode<T>[]): void {
		for (const node of nodes) {
			if (node.path === start)
				startIdx = currentIdx
			if (node.path === end)
				endIdx = currentIdx

			result.push(node.path as T)
			currentIdx++

			if (node.children?.length)
				traverseAndFind(node.children)
		}
	}

	traverseAndFind(tree)

	if (startIdx === -1 || endIdx === -1)
		return []

	const [from, to] = startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx]
	return result.slice(from, to + 1)
}

/**
 * Removes nodes with specified values from the tree, including their subtrees.
 * Returns a new tree without modifying the original.
 *
 * @template T - The type of node path
 * @param {TreeNode<T>[]} tree - The original tree (array of root nodes)
 * @param {T[]} valuesToRemove - Array of values to remove
 * @returns {TreeNode<T>[]} New tree with specified nodes and their subtrees removed
 * @example
 * const tree = [
 *   { value: 'a', children: [{ value: 'b' }, { value: 'c' }] },
 *   { value: 'd' }
 * ]
 * removeTreeNodes(tree, ['b', 'd']) // [{ value: 'a', children: [{ value: 'c' }] }]
 * removeTreeNodes(tree, ['a']) // [{ value: 'd' }]
 */
export function removeTreeNodes<Node extends TreeNode = TreeNode, Path extends string = string>(
	tree: Node[],
	valuesToRemove: Path[],
): Node[] {
	const removeSet = new Set(valuesToRemove)
	return filterTree(tree, n => !removeSet.has(n.path as Path))
}
