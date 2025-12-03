import type { TreeItem } from '@nui/components'
import type { NuanceColor } from '@nui/types'
import type { ModelRef } from 'vue'

import { createStrictInjection } from '@nui/helpers'


type TreeEventType = 'select' | 'expand'

export interface TreeContext<T extends string = string> {
	selected: ModelRef<T[]>
	expanded: ModelRef<T[]>
	multiple?: boolean

	iconResolver: <T extends string = string>(item: TreeItem<T>) => {
		icon: string
		color?: NuanceColor
	}
}

const injectionKey = Symbol('nui-tree')
const [useProvide, useState] = createStrictInjection((state: TreeContext) => {
	const on = (type: TreeEventType, value: string) => {
		switch (type) {
			case 'select': {
				const exist = state.selected.value.includes(value)
				if (!exist)
					state.selected.value = [...state.selected.value, value]
				break
			}
			case 'expand': {
				const exist = state.expanded.value.includes(value)
				if (!exist)
					state.expanded.value = [...state.expanded.value, value]
				break
			}
			default:
				return console.warn(`Unknown target type in NuiTree: ${type}`)
		}
	}

	const off = (type: TreeEventType, value: string) => {
		switch (type) {
			case 'select':
				return state.selected.value = state.selected.value.filter(i => i !== value)
			case 'expand':
				return state.expanded.value = state.expanded.value.filter(i => i !== value)
			default:
				return console.warn(`Unknown target type in NuiTree: ${type}`)
		}
	}

	const toggle = (type: TreeEventType, value: string) => {
		switch (type) {
			case 'select': {
				const active = state.selected.value.includes(value)
				return active ? off(type, value) : on(type, value)
			}
			case 'expand': {
				const active = state.expanded.value.includes(value)
				return active ? off(type, value) : on(type, value)
			}
			default:
				return console.warn(`Unknown target type in NuiTree: ${type}`)
		}
	}

	return {
		...state,
		toggle,
		on,
		off,
	}
}, {
	injectionKey,
	name: 'TreeState',
})

export const useProvideTreeState = useProvide
export const useTreeState = useState
