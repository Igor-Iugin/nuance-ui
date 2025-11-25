import type { UiKitSize } from '@types'
import type { CSSProperties, ModelRef } from 'vue'

import { createStrictInjection } from '@helpers'

import type { ComboboxItem } from '../model'
import type { ComboboxStore } from './use-combobox/use-combobox'


interface ComboboxState {
	opened: ModelRef<boolean>
	onOptionSubmit?: (value: string, option: ComboboxItem) => void
	size: UiKitSize
	readOnly: boolean
	store: ComboboxStore
	dropdownPadding?: UiKitSize | CSSProperties['padding']
}

const injectionKey = Symbol('combobox-store')
export const [useProvide, useState] = createStrictInjection<[ComboboxState], ComboboxState>(state => state, {
	injectionKey,
	name: 'ComboboxState',
})

export const useProvideComboboxState = useProvide
export const useComboboxState = useState
