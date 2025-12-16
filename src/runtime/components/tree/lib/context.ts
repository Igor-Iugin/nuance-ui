import type { ButtonProps } from '@nui/components'
import type { ModelRef, ShallowRef } from 'vue'

import { createStrictInjection } from '@nui/helpers'
import { unrefElement } from '@vueuse/core'

import type { TreeIconResolver, TreeLoader } from '../model'


type EventType = 'select' | 'expand'
type SelectMode = 'single' | 'multiple' | 'range'

export interface TreeContext {
	root: ShallowRef<HTMLUListElement | null>
	active: ModelRef<string | null>
	selected: ModelRef<string[]>
	expanded: ModelRef<string[]>

	iconResolver: TreeIconResolver
	loadBranch: TreeLoader

	selectable: boolean

	variant: ButtonProps['variant']
	color: ButtonProps['color']
	size: ButtonProps['size']
}

export interface TreeState extends Omit<TreeContext, 'root'> {
	toggle: (type: EventType, path: string, mode?: SelectMode) => void
	on: ((type: 'expand', path: string) => void) & ((type: 'select', path: string, mode?: SelectMode) => void)
	off: (type: EventType, path: string) => void
	setActive: (path: string | null) => void
}

const injectionKey = Symbol('nui-tree')
const [useProvide, useState] = createStrictInjection(({
	root,
	active,
	selected,
	expanded,
	iconResolver,
	selectable,
	...rest
}: TreeContext): TreeState => {
	const setActive = (value: string | null) => active.value = value

	function on(type: 'expand', path: string): void
	function on(type: 'select', path: string, mode?: SelectMode): void
	function on(type: EventType, path: string, mode?: SelectMode) {
		if (type === 'select') {
			setActive(path)

			if (!selectable)
				return

			switch (mode) {
				case 'single':
					return selected.value = [path]
				case 'multiple': {
					const exist = selected.value.includes(path)
					if (!exist)
						selected.value = [...selected.value, path]
					return
				}
				case 'range': {
					if (!active.value || active.value === path || !root.value)
						return

					const elements = unrefElement(root)?.querySelectorAll('[data-tree-item]')
					if (!elements)
						return

					const newSelected = new Set<string>()
					let startIx = -1

					for (const [ix, elem] of elements.entries()) {
						const elemPath = elem.getAttribute('data-tree-item')
						if (!elemPath)
							continue

						const isBoundary = elemPath === active.value || elemPath === path

						if (isBoundary || startIx >= 0)
							newSelected.add(elemPath)

						if (isBoundary) {
							if (startIx >= 0)
								break
							startIx = ix
						}
					}

					return selected.value = [...newSelected]
				}
				default:
					return selected.value = [path]
			}
		}

		if (type === 'expand') {
			if (!expanded.value.includes(path))
				expanded.value = [...expanded.value, path]
			return
		}

		return console.warn(`Unknown target type in NuiTree: ${type}`)
	}

	const off = (type: EventType, path: string) => {
		switch (type) {
			case 'select': {
				selected.value = selected.value.filter(i => i !== path)
				// Если убираем активный элемент, сбрасываем active
				if (active.value === path)
					active.value = selected.value[0] ?? null
				return
			}
			case 'expand':
				return expanded.value = expanded.value.filter(v => !v.startsWith(path))
			default:
				return console.warn(`Unknown target type in NuiTree: ${type}`)
		}
	}

	const toggle = (type: EventType, path: string, mode: SelectMode = 'single') => {
		switch (type) {
			case 'select': {
				const isSelected = selected.value.includes(path)

				// В single mode всегда устанавливаем новое значение
				if (mode === 'single')
					return on(type, path, mode)

				// В multiple mode переключаем состояние
				if (mode === 'multiple')
					return isSelected ? off(type, path) : on(type, path, mode)

				// В range mode всегда добавляем диапазон
				if (mode === 'range')
					return on(type, path, mode)

				return
			}
			case 'expand':
				return expanded.value.includes(path) ? off(type, path) : on(type, path)
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

export const useProvideTreeState = useProvide
export const useTreeState = useState
