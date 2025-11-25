<script setup lang='ts' generic='Value extends string = string, Ext extends ComboboxItemExt = object'>
import { nextTick, useId, watch } from 'vue'

import type { ComboboxData, ComboboxItem, ComboboxItemExt, ComboboxRootEmits, ComboboxTargetProps } from '../combobox'
import type { InputProps } from '../input'

import Button from '../button/button.vue'
import { useCombobox, useComboboxData } from '../combobox'
import ComboboxOptionsDropdown from '../combobox/combobox-options-dropdown.vue'
import ComboboxRoot from '../combobox/combobox-root.vue'
import ComboboxTarget from '../combobox/combobox-target.vue'
import Input from '../input/input.vue'


export interface SelectProps<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> extends Omit<InputProps, 'modelValue' | 'multiline' | 'resize' | 'is' | 'id'>, Pick<ComboboxTargetProps, 'autoComplete'> {
	data: ComboboxData<Value, Ext>

	/** Determines whether the select should be searchable @default `false` */
	searchable?: boolean

	/** If set, the check icon is displayed near the selected option label @default `true` */
	withCheckIcon?: boolean

	/** Position of the check icon relative to the option label @default `'left'` */
	iconPosition?: 'left' | 'right'

	/** Message displayed when no option matches the current search query when the `searchable` prop is set or there is no data */
	nothingFoundMessage?: string

	/** If set, it becomes possible to deselect value by clicking on the selected option @default `true` */
	allowDeselect?: boolean

	/** If set, the clear button is displayed in the right section when the component has value @default `false` */
	// clearable?: boolean

	limit?: number
	/** Props passed down to the underlying `ScrollArea` component in the dropdown */
	// scrollAreaProps?: ScrollAreaProps
}

const {
	data,
	disabled,
	searchable = false,
	rightSectionPE = 'none',
	readonly = false,
	allowDeselect = false,
	autoComplete = 'off',
	limit,
	iconPosition,
	nothingFoundMessage,
	withCheckIcon,
	...rest
} = defineProps<SelectProps<Value, Ext>>()

const emit = defineEmits<ComboboxRootEmits>()

const opened = defineModel<boolean>('open', { default: false })
const value = defineModel<ComboboxItem<Value, Ext> | null>({ default: null })

const { parsed, options } = useComboboxData<Value, Ext>(data)

const id = useId()
const store = useCombobox({
	listId: id,
	opened,
	loop: true,
	scrollBehavior: 'instant',
	onSelect: ix => emit('select', ix),
	onClear: () => emit('clear'),
	onOpenDropdown: source => {
		emit('open', source)
		store.updateSelectedOptionIx('active', { scrollIntoView: true })
	},
	onCloseDropdown: source => {
		emit('close', source)
		nextTick(() => store.resetSelectedOption())
	},
})

const search = defineModel<string>('search', { default: '' })
watch(search, () => nextTick(() => store.resetSelectedOption()))
</script>

<template>
	<ComboboxRoot
		v-model:open='opened'
		width='target'
		:store
		@submit='(val, option) => {
			$emit("submit", val, option)
			const optionsLockup = allowDeselect
				? options[val]?.value === value?.value ? null : options[val]
				: options[val]
			const nextValue: ComboboxItem<Value, Ext> | null = optionsLockup ? optionsLockup : null

			value = nextValue
			search = nextValue?.label ?? ""

			store.closeDropdown()
		}'
	>
		<ComboboxTarget :target-type='searchable ? "input" : "button"' :auto-complete>
			<component
				:is='searchable ? Input : Button'
				:id
				v-bind='{ ...rest, ...$attrs }'
				v-model='search'
				:disabled
				:right-section-p-e
				:readonly='readonly || !searchable'
				:class='$style.input'
				@focus='() => searchable && store.openDropdown()'
				@blur='() => {
					searchable && store.closeDropdown()
					search = value?.label ?? ""
				}'
				@click.prevent.stop='() => searchable ? store.openDropdown() : store.toggleDropdown()'
			>
				{{ value?.value ?? null }}
				<template #label>
					<slot name='label' />
				</template>
				<template #description>
					<slot name='description' />
				</template>
				<template #error>
					<slot name='error' />
				</template>

				<template v-if='$slots.leftSection || value?.icon' #leftSection>
					<slot name='leftSection'>
						<Icon v-if='value?.icon' :name='value?.icon' />
					</slot>
				</template>
				<template #rightSection>
					<slot name='rightSection'>
						<Icon name='gravity-ui:chevrons-expand-vertical' />
					</slot>
				</template>
			</component>
		</ComboboxTarget>
		<ComboboxOptionsDropdown
			v-model='value'
			:data='parsed'
			:limit
			:with-check-icon
			:icon-position
			:nothing-found-message
			:aria-label='id'
			:label-id='id'
		/>
	</ComboboxRoot>
</template>

<style module lang='postcss'>
.input {
	:where([readonly]) {
		cursor: pointer;
	}
}
</style>
