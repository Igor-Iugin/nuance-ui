<script setup lang='ts'>
import PopoverTarget from '../popover/popover-target.vue'
import { useComboboxState } from './lib/context'
import { useComboboxTarget } from './lib/use-combobox-target'


export interface ComboboxTargetProps {
	/** If set, the component responds to keyboard events @default `true` */
	withKeyboardNavigation?: boolean

	/** If set, the target has `aria-` attributes @default `true` */
	withAriaAttributes?: boolean

	/** If set, the target has `aria-expanded` attribute @default `false` */
	withExpandedAttribute?: boolean

	/**
	 * Determines which events is handled by the target element.
	 * `button` target type handles `Space` and `Enter` keys to toggle dropdown opened state.
	 * @default `input`
	 */
	targetType?: 'button' | 'input'

	/** Input autocomplete attribute */
	autoComplete?: string
}

const {
	withAriaAttributes = true,
	withExpandedAttribute = true,
	withKeyboardNavigation = true,
	targetType = 'input',
	autoComplete = 'off',
} = defineProps<ComboboxTargetProps>()

const aria = useComboboxTarget({
	targetType,
	withKeyboardNavigation,
	withExpandedAttribute,
	autoComplete,
	withAriaAttributes,
})

const { store: { targetRef } } = useComboboxState()
</script>

<template>
	<PopoverTarget ref='targetRef' v-bind='aria'>
		<slot />
	</PopoverTarget>
</template>
