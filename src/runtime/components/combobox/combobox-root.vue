<script setup lang='ts'>
import type { UiKitSize } from '@types'
import type { CSSProperties } from 'vue'

import type { PopoverProps } from '../popover'
import type { ComboboxStore } from './lib/use-combobox'
import type { ComboboxRootEmits } from './model'

import Popover from '../popover/popover.vue'
import { useProvideComboboxState } from './lib/context'
import { useCombobox } from './lib/use-combobox'


export interface ComboboxProps extends PopoverProps {
	store?: ComboboxStore

	/** Determines whether arrow key presses should loop though items (first to last and last to first), `true` by default */
	loop?: boolean

	/** `behavior` passed down to `element.scrollIntoView`, `'instant'` by default */
	scrollBehavior?: ScrollBehavior

	/** Controls items `font-size` and `padding` @default `'sm'` */
	size?: UiKitSize

	/** Controls `padding` of the dropdown @default `4` */
	dropdownPadding?: UiKitSize | CSSProperties['padding']

	/** Determines whether the `Combobox` value can be changed */
	readOnly?: boolean
}

const {
	scrollBehavior = 'instant',
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
	scrollBehavior,
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
