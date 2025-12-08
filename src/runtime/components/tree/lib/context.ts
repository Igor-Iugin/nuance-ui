import type { ButtonProps, TreeIconResolver, TreeItem } from '@nui/components'
import type { ModelRef } from 'vue'

import { createStrictInjection } from '@nui/helpers'
import { getBranchChildren, getTreeItemsBetween } from '@nui/utils'


type EventType = 'select' | 'expand'
type SelectMode = 'single' | 'multiple' | 'range'

export interface TreeContext<T extends string = string> {
	tree: ModelRef<TreeItem<T>[]>
	active: ModelRef<T | null>
	selected: ModelRef<T[]>
	expanded: ModelRef<T[]>

	iconResolver: TreeIconResolver<T>

	selectable: boolean

	variant: ButtonProps['variant']
	color: ButtonProps['color']
	size: ButtonProps['size']
}

export interface TreeState<T extends string = string> {
	active: ModelRef<T | null>
	selected: ModelRef<T[]>
	expanded: ModelRef<T[]>

	iconResolver: TreeIconResolver<T>

	toggle: (type: EventType, value: T, mode?: SelectMode) => void
	on: ((type: 'expand', value: T) => void) & ((type: 'select', value: T, mode?: SelectMode) => void)
	off: (type: EventType, value: T) => void
	setActive: (value: T | null) => void

	selectable: boolean

	variant: ButtonProps['variant']
	color: ButtonProps['color']
	size: ButtonProps['size']
}

const injectionKey = Symbol('nui-tree')
const [useProvide, useState] = createStrictInjection(<T extends string>({
	tree,
	active,
	selected,
	expanded,
	iconResolver,
	selectable,
	...rest
}: TreeContext<T>): TreeState<T> => {
	const setActive = (value: T | null) => active.value = value

	// Expand
	function on(type: 'expand', value: T): void
	function on(type: 'select', value: T, mode?: SelectMode): void
	function on(type: EventType, value: T, mode?: SelectMode) {
		if (type === 'select') {
			setActive(value)

			if (!selectable)
				return

			switch (mode) {
				case 'single':
					return selected.value = [value]
				case 'multiple': {
					const exist = selected.value.includes(value)
					if (!exist)
						selected.value = [...selected.value, value]
					return
				}
				case 'range': {
					if (!active.value || active.value === value)
						return

					const range = getTreeItemsBetween(tree.value, active.value, value)
					return selected.value = [...new Set([...selected.value, ...range])]
				}
				default:
					return selected.value = [value]
			}
		}

		if (type === 'expand') {
			const exist = expanded.value.includes(value)
			if (!exist)
				expanded.value = [...expanded.value, value]
			return
		}

		return console.warn(`Unknown target type in NuiTree: ${type}`)
	}

	const off = (type: EventType, value: T) => {
		switch (type) {
			case 'select': {
				selected.value = selected.value.filter(i => i !== value)
				// Если убираем активный элемент, сбрасываем active
				if (active.value === value)
					active.value = selected.value[0] ?? null
				return
			}
			case 'expand': {
				const children = new Set(getBranchChildren(tree.value, value))
				return expanded.value = expanded.value
					.filter(v => v !== value && !children.has(v))
			}
			default:
				return console.warn(`Unknown target type in NuiTree: ${type}`)
		}
	}

	const toggle = (type: EventType, value: T, mode: SelectMode = 'single') => {
		switch (type) {
			case 'select': {
				const isSelected = selected.value.includes(value)

				// В single mode всегда устанавливаем новое значение
				if (mode === 'single')
					return on(type, value, mode)

				// В multiple mode переключаем состояние
				if (mode === 'multiple')
					return isSelected ? off(type, value) : on(type, value, mode)

				// В range mode всегда добавляем диапазон
				if (mode === 'range')
					return on(type, value, mode)

				return
			}
			case 'expand': {
				const isExpanded = expanded.value.includes(value)
				return isExpanded ? off(type, value) : on(type, value)
			}
			default:
				console.warn(`Unknown target type in NuiTree: ${type}`)
		}
	}

	return {
		on,
		off,
		toggle,
		setActive,
		active,
		selected,
		expanded,
		iconResolver,
		selectable,
		...rest,
	}
}, {
	injectionKey,
	name: 'TreeState',
})

export function useProvideTreeState<T extends string = string>(ctx: TreeContext<T>) {
	// @ts-expect-error
	return useProvide(ctx) as unknown as TreeState<T>
}

export function useTreeState<T extends string = string>() {
	return useState() as unknown as TreeState<T>
}
