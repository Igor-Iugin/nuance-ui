<script setup lang='ts'>
import type { NuanceSize } from '@nui/types'
import type { CSSProperties } from 'vue'

import type { PopoverProps } from '../popover'
import type { ComboboxStore } from './lib/use-combobox'
import type { ComboboxRootEmits } from './types'

import Popover from '../popover/popover.vue'
import { useProvideComboboxState } from './lib/context'
import { useCombobox } from './lib/use-combobox'


export interface ComboboxProps extends PopoverProps {
	/** External combobox store; creates an internal one if omitted */
	store?: ComboboxStore

	/** Loops arrow-key navigation from last item to first and back */
	loop?: boolean

	/**
	 * Component size
	 * @default `'sm'`
	 */
	size?: NuanceSize

	/** Padding token for the dropdown */
	dropdownPadding?: NuanceSize | CSSProperties['padding']

	/** Prevents value changes */
	readOnly?: boolean
}

const {
	loop = true,
	readOnly = false,
	size = 'sm',
	store: _store,
	dropdownPadding,
	...rest
} = defineProps<ComboboxProps>()

const emit = defineEmits<ComboboxRootEmits>()
const opened = defineModel<boolean>('open', { default: false })

const store = _store ?? useCombobox({
	loop,
	scrollBehavior: 'instant',
	onSelect: ix => emit('select', ix),
	onClear: () => emit('clear'),
	onOpenDropdown: source => emit('open', source),
	onCloseDropdown: source => emit('close', source),
	opened,
})

useProvideComboboxState({
	store,
	opened,
	readOnly,
	size,
	onOptionSubmit: (value, option) => emit('submit', value, option),
	dropdownPadding,
})
</script>

<template>
	<Popover v-bind='rest' v-model:open='opened'>
		<slot />
	</Popover>
</template>
