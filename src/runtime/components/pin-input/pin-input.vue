<script lang="ts" setup>
import { useVarsResolver } from '@nui/composables'
import { getSize } from '@nui/utils'
import { computed, useId } from 'vue'

import type { NuanceRadius, NuanceSize, NuanceSpacing } from '../../types'
import type { BoxProps } from '../box.vue'

import Group from '../group.vue'
import InputBase from '../input/ui/input-base.vue'
import VisuallyHiddenInput from '../visually-hidden/visually-hidden-input.vue'
import { createPinArray, pinValidate } from './lib'
import { usePinInput } from './use-pin-input'


export interface PinInputEmits {
	complete: [value: string]
}

export interface PinInputProps extends BoxProps {
	/** Id auto-generated if not provided */
	id?: string

	/** Hidden input `name` attribute */
	name?: string

	/** Key of `theme.spacing` or any valid CSS value to set `gap` between inputs, numbers are converted to rem @default 'md' */
	gap?: NuanceSpacing

	/** Key of `theme.radius` or any valid CSS value to set `border-radius`, numbers are converted to rem @default 'md' */
	radius?: NuanceRadius

	/** Controls inputs `width` and `height` @default 'sm' */
	size?: NuanceSize

	/** If set, the first input is focused when component is mounted @default false */
	autoFocus?: boolean

	/** Inputs placeholder */
	placeholder?: string

	/** Determines whether focus should be moved automatically to the next input once filled @default true */
	manageFocus?: boolean

	/** Determines whether `autocomplete="one-time-code"` attribute should be set on all inputs @default true */
	otp?: boolean

	/** Adds disabled attribute to all inputs */
	disabled?: boolean

	/** Sets `aria-invalid` attribute and applies error styles to all inputs */
	error?: boolean

	/** Determines which values can be entered @default 'alphanumeric' */
	type?: 'alphanumeric' | 'number' | RegExp

	/** Changes input type to `"password"` @default false */
	mask?: boolean

	/** Number of inputs @default 4 */
	length?: number

	/** If set, the user cannot edit the value */
	readOnly?: boolean

	/** `aria-label` attribute */
	ariaLabel?: string

	/** Marks the field as required */
	required?: boolean
}

const {
	id,
	name,
	disabled,
	required,
	length = 4,
	otp = true,
	type = 'number',
	mask,
	gap,
	placeholder,
	autoFocus,
	manageFocus = true,
	size,
	radius = 'md',
	readOnly,
	error,
} = defineProps<PinInputProps>()

defineEmits<PinInputEmits>()

const uuid = computed(() => id ?? useId())
const inputMode = computed(() => type === 'number' ? 'numeric' : 'text')

const model = defineModel<string>({ default: '' })

const {
	refs,
	focus,
	focusedIx,
	cells,
	setFieldValue,
	handleKeydown,
} = usePinInput({
	length: () => length,
	manageFocus,
	value: model,
	inputMode,
})

function handleInput(event: InputEvent, ix: number) {
	const target = event.target as HTMLInputElement
	const inputValue = target.value

	if (inputValue.length > 1) {
		const isPaste = inputValue.length > 2
		if (isPaste) {
			const isValid = pinValidate(inputValue, type)
			if (!isValid)
				return

			cells.value = createPinArray(length, inputValue)
			const filledCount = Math.min(inputValue.length, length)
			if (filledCount < length)
				focus('next', filledCount - 1)
			return
		}

		const newChar = inputValue.split('')[inputValue.length - 1]!
		if (pinValidate(newChar, type)) {
			setFieldValue(newChar, ix)
			focus('next', ix)
		}
		return
	}

	if (inputValue.length === 1) {
		if (pinValidate(inputValue, type)) {
			setFieldValue(inputValue, ix)
			focus('next', ix)
		}
		else {
			setFieldValue('', ix)
		}
	}
	else if (inputValue.length === 0) {
		setFieldValue('', ix)
	}
}

function handlePaste(event: ClipboardEvent) {
	const pasteData = event.clipboardData?.getData('text/plain').replace(/\s+/g, '').trim()!
	const isValid = pinValidate(pasteData, type)

	if (!isValid)
		return

	const pasteArray = createPinArray(length, pasteData)
	cells.value = pasteArray

	const filledCount = pasteArray.filter(v => v !== '').length
	const focusIx = filledCount >= length ? length - 1 : filledCount
	refs.value[focusIx]?.focus()
}

interface PinVars {
	root:
		| '--pin-size'
		| '--pin-fz'
}

const style = useVarsResolver<PinVars>(() => ({
	root: {
		'--pin-size': getSize(size, 'pin-size'),
		'--pin-fz': getSize(size, 'pin-fz'),
	},
}))
</script>

<template>
	<Group
		role='group'
		wrap='nowrap'
		:gap
		dir='ltr'
		:class='$style.root'
		:style='style.root'
	>
		<InputBase
			v-for='(ids, ix) in length'
			:id='`${uuid}-${ix + 1}`'
			:key='ids'
			:error
			:class='$style.pinRoot'
			:radius
		>
			<template #default='{ id: _id, css }'>
				<input
					:id='_id'
					:key='ids'
					:ref='refs.set'
					:class='[css, $style.pin]'
					:value='cells[ix]'
					:autocomplete='otp ? "one-time-code" : undefined'
					:input-mode
					:type='mask ? "password" : "text"'
					:placeholder
					:auto-focus='autoFocus && ix === 0'
					:readonly='readOnly'
					:disabled
					@input='handleInput($event, ix)'
					@focus='(event: FocusEvent) => {
						if (!readOnly){
							(event.target as HTMLInputElement)?.select()
							focusedIx = ix
						}
					}'
					@blur='focusedIx = -1'
					@paste.prevent='handlePaste'
					@keydown='handleKeydown($event, ix)'
				>
			</template>
		</InputBase>
	</Group>
	<VisuallyHiddenInput
		:name
		:disabled
		:required
	/>
</template>

<style lang="css" module>
.root {
	--pin-size-xs: rem(30px);
	--pin-size-sm: rem(36px);
	--pin-size-md: rem(42px);
	--pin-size-lg: rem(50px);
	--pin-size-xl: rem(60px);
	--pin-size: var(--pin-size-sm);

	--pin-fz-xs: 1.125rem;
	--pin-fz-sm: 1.5rem;
	--pin-fz-md: 1.75rem;
	--pin-fz-lg: 2rem;
	--pin-fz-xl: 2.5rem;

	--pin-fz: var(--pin-fz-sm);
}

.pinRoot {
	@mixin where-light {
		--input-bd: var(--color-gray-2);
		--input-bg: var(--color-gray-0);
	}

	@mixin where-dark {
		--input-bd: var(--color-gray-7);
		--input-bg: var(--color-dark-9);
	}
}

.pin {
	width: var(--pin-size);
	height: calc(var(--pin-size) + var(--pin-size) / 3);
	padding: 0;

	font-size: var(--pin-fz);
	font-weight: 600;
	line-height: 1;
	text-align: center;
}
</style>
