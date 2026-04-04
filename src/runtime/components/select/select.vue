<script setup lang='ts' generic='Value extends string = string, Ext extends ComboboxItemExt = object'>
import { computed, nextTick, ref, watch } from 'vue'

import type { ComboboxData, ComboboxItemExt, ComboboxRootEmits } from '../combobox'
import type { TextInputProps } from '../input'

import { useCombobox, useComboboxData } from '../combobox'
import ComboboxOptionsDropdown from '../combobox/combobox-options-dropdown.vue'
import ComboboxRoot from '../combobox/combobox-root.vue'
import ComboboxTarget from '../combobox/combobox-target.vue'
import TextInput from '../input/text-input.vue'
import ButtonInput from '../input/ui/button-input.vue'


export interface SelectProps<
	Value extends string = string,
	Ext extends ComboboxItemExt = object,
> extends Omit<TextInputProps, 'modelValue' | 'multiline' | 'resize' | 'is' | 'id'> {
	options: ComboboxData<Value, Ext>

	/** Determines whether the select should be searchable @default `false` */
	searchable?: boolean

	/** If set, multiple options can be selected @default `false` */
	multiple?: boolean

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

	/** Icon displayed in the left section by default */
	icon?: string

	limit?: number

	/** Input autocomplete attribute */
	autoComplete?: string
}

const {
	options: data,
	disabled,
	searchable = false,
	multiple = false,
	rightSectionPE = 'none',
	readonly = false,
	allowDeselect = false,
	autoComplete = 'off',
	icon,
	limit,
	iconPosition,
	nothingFoundMessage,
	withCheckIcon = true,
	...rest
} = defineProps<SelectProps<Value, Ext>>()

const emit = defineEmits<ComboboxRootEmits>()

/** Dropdown opened state */
const opened = defineModel<boolean>('open', { default: false })
/** Value handler */
const value = defineModel<string | string[] | null>({ default: null })
/** Search handler */
const search = defineModel<string>('search', { default: '' })

const { parsed, options } = useComboboxData<Value, Ext>(data)
const store = useCombobox({
	opened,
	loop: true,
	scrollBehavior: 'instant',
	onSelect: ix => emit('select', ix),
	onClear: () => emit('clear'),
	onOpenDropdown: source => {
		emit('open', source)
		if (searchable)
			search.value = ''
		store.updateSelectedOptionIx('active', { scrollIntoView: true })
	},
	onCloseDropdown: source => {
		emit('close', source)
		nextTick(() => store.resetSelectedOption())
	},
})

// ─── Search ───

watch(search, () => nextTick(() => store.resetSelectedOption()))

const display = computed(() => {
	const v = value.value
	if (multiple && Array.isArray(v)) {
		return v.map(val => options.value[val]?.label ?? val).join(', ')
	}
	if (v && typeof v === 'string') {
		return options.value[v]?.label ?? v
	}
	return ''
})

const focused = ref(false)
const inputValue = computed({
	get: () => searchable && focused.value ? search.value : display.value,
	set: (val: string) => { search.value = val },
})

// ─── Handlers ───

function onSubmit(val: string) {
	if (multiple) {
		const current = Array.isArray(value.value) ? value.value : []
		value.value = current.includes(val)
			? current.filter(v => v !== val)
			: [...current, val]
		search.value = ''
	}
	else {
		const nextValue = allowDeselect && value.value === val ? null : val
		value.value = options.value[val] ? nextValue : null
		search.value = ''
		store.closeDropdown()
	}
}

function onBlur() {
	focused.value = false
}
</script>

<template>
	<ComboboxRoot
		v-model:open='opened'
		width='target'
		:store
		@submit='(val, option) => {
			$emit("submit", val, option)
			onSubmit(val)
		}'
	>
		<ComboboxTarget :target-type='searchable ? "input" : "button"' :auto-complete>
			<component
				:is='searchable ? TextInput : ButtonInput'
				:id='store.listId'
				v-bind='{ ...rest, ...$attrs }'
				v-model='inputValue'
				:disabled
				:right-section-p-e
				:readonly='readonly || !searchable'
				:class='$style.input'
				@focus='focused = true'
				@blur='onBlur'
				@click.prevent.stop='() => searchable ? store.openDropdown() : store.toggleDropdown()'
			>
				<slot v-if='display' name='selection' :value='value' :display='display'>
					{{ display }}
				</slot>

				<template v-if='$slots?.label' #label>
					<slot name='label' />
				</template>
				<template v-if='$slots?.description' #description>
					<slot name='description' />
				</template>
				<template v-if='$slots?.error' #error>
					<slot name='error' />
				</template>

				<template v-if='$slots.leftSection || icon' #leftSection>
					<slot name='leftSection'>
						<Icon v-if='icon' :name='icon' />
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
			v-model:search='search'
			:data='parsed'
			:limit
			:with-check-icon
			:icon-position
			:nothing-found-message
			:aria-label='store.listId'
			:label-id='store.listId'
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
