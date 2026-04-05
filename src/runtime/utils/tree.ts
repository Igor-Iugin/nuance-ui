/** Node of a generic string-keyed tree. */
export interface TreeNode<T extends string = string> {
	/** Path-like identifier of the node. */
	path: string
	/** Child nodes of this node. */
	children?: TreeNode<T>[]
}

/**
 * Recursively traverses a tree and collects all nodes in depth-first order.
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
 * Returns a new tree containing only the nodes that match the predicate.
 *
 * A parent is kept whenever at least one of its (recursively filtered)
 * descendants matches, even if the parent itself does not.
 */
export function filterTree<Node extends TreeNode = TreeNode>(
	tree: Node[],
	predicate: (node: Node) => boolean,
): Node[] {
	const result: Node[] = []

	for (const node of tree) {
		const filteredChildren = node.children?.length
			? filterTree(node.children as Node[], predicate)
			: undefined

		// Keep a node when it matches the predicate, or when it has at
		// least one surviving descendant after filtering.
		if (predicate(node) || (filteredChildren && filteredChildren.length > 0)) {
			const newNode: Node = { ...node }
			if (filteredChildren && filteredChildren.length > 0)
				newNode.children = filteredChildren
			else
				// Drop an empty children array so leaves stay leaves.
				delete newNode.children

			result.push(newNode)
		}
	}

	return result
}

/**
 * Finds a tree node by its `path` using depth-first search.
 *
 * Returns `null` when no matching node exists.
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

/** Flattens a tree into a single array in depth-first order. */
export function flatTree<T extends string = string>(tree: TreeNode<T>[]): TreeNode<T>[] {
	return traverse(tree)
}

/**
 * Returns all descendant paths of the node with the given `path`.
 *
 * The result is empty when the node is not found or has no children.
 */
export function getBranchChildren<T extends string = string>(
	tree: TreeNode<T>[],
	path: T,
): T[] {
	const children: T[] = []

	function findAndExtract(nodes: TreeNode<T>[]): boolean {
		for (const node of nodes) {
			if (node.path === path) {
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
 * Returns all node paths between `start` and `end` (inclusive) in
 * depth-first traversal order.
 *
 * If `start` comes after `end` in traversal order, the range is
 * automatically reversed. Returns an empty array when either endpoint is
 * missing.
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
 * Returns a new tree with the given paths and their subtrees removed.
 *
 * The input tree is not mutated.
 */
export function removeTreeNodes<Node extends TreeNode = TreeNode, Path extends string = string>(
	tree: Node[],
	valuesToRemove: Path[],
): Node[] {
	const removeSet = new Set(valuesToRemove)
	return filterTree(tree, n => !removeSet.has(n.path as Path))
}
