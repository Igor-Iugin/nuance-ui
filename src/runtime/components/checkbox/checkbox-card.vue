<script setup lang='ts'>
import type { NuanceRadius } from '@nui/types'
import type { Mod } from '@nui/utils'

import { getRadius } from '@nui/utils'
import { computed } from 'vue'

import UnstyledButton from '../button/unstyled-button.vue'
import { useProvideCheckboxCard } from './lib/card.context'
import { useCheckboxGroupState } from './lib/group.context'


export interface CheckboxCardProps {
	/** Element modifiers transformed into `data-` attributes, falsy values are removed */
	mod?: Mod | Mod[]

	/** Shows a border around the card */
	withBorder?: boolean

	/** Border radius */
	radius?: NuanceRadius

	/** Disables the component */
	disabled?: boolean | undefined

	/** Value used in checkbox group context */
	value?: string
}

const {
	withBorder,
	value,
	mod,
	radius,
	disabled: _disabled,
} = defineProps<CheckboxCardProps>()

const ctx = useCheckboxGroupState()
const modelValue = defineModel<boolean>({ default: false })

const checked = computed({
	get: () => {
		if (ctx && value !== undefined)
			return ctx.isSelected(value)

		return modelValue.value
	},
	set: (check: boolean) => {
		if (ctx && value !== undefined)
			return ctx.update(value)

		modelValue.value = check
	},
})

const disabled = computed(() => {
	if (_disabled)
		return true

	if (ctx && value !== undefined)
		return ctx.isDisabled(value)

	return false
})

useProvideCheckboxCard({
	value: checked,
	onUpdate: () => checked.value = !checked.value,
})

const style = computed(() => ({
	'--card-radius': getRadius(radius),
}))
</script>

<template>
	<UnstyledButton
		:mod='[{ checked, "with-border": withBorder }, mod]'
		:value='checked'
		:class='$style.root'
		:style
		:disabled
		@click='checked = !checked'
	>
		<slot />
	</UnstyledButton>
</template>

<style module lang='postcss'>
.root {
	--card-radius: var(--radius-default);

	cursor: pointer;

	display: block;

	width: 100%;

	border-radius: var(--card-radius);

	& :where(*) {
		cursor: inherit;
	}

	&:where([data-with-border]) {
		border: 1px solid transparent;

		@mixin where-light {
			border-color: var(--color-gray-3);
		}

		@mixin where-dark {
			border-color: var(--color-dark-4);
		}
	}
}
</style>
