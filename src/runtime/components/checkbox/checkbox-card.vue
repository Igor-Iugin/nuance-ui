<script setup lang='ts'>
import type { Mod } from '@composals'
import type { UiKitRadius } from '@types'

import { getRadius } from '@utils'
import { computed } from 'vue'

import { UnstyledButton } from '../button'
import { useProvideCheckboxCard } from './lib/card.context'
import { useCheckboxGroupState } from './lib/group.context'


export interface CheckboxCardProps {
	mod?: Mod | Mod[]
	withBorder?: boolean
	radius?: UiKitRadius
	value?: string
}

const {
	withBorder,
	value: _value,
	mod,
	radius,
} = defineProps<CheckboxCardProps>()

const ctx = useCheckboxGroupState()
const modelValue = defineModel<boolean>({ default: false })

const checked = computed(() => {
	if (ctx?.value && _value)
		return ctx?.value.value.includes(_value)

	return modelValue.value
})

function onUpdate() {
	if (_value && ctx?.onUpdate)
		return ctx.onUpdate(_value)

	return modelValue.value = !modelValue.value
}

useProvideCheckboxCard({ value: checked, onUpdate })

const style = computed(() => ({
	'--card-radius': getRadius(radius),
}))
</script>

<template>
	<UnstyledButton
		:mod='[{ checked, "with-border": withBorder }, mod]'
		:value='_value'
		:class='$style.root'
		:style
		@click='onUpdate()'
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
