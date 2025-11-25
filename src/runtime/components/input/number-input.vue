<script setup lang='ts'>
import { clamp, useCounter } from '@vueuse/core'
import { shallowRef, useId, watch } from 'vue'

import type { InputWrapperProps } from './index'
import type { InputBaseProps } from './types'

import UnstyledButton from '../button/unstyled-button.vue'
import BaseInput from './ui/input-base.vue'
import InputWrapper from './ui/input-wrapper.vue'


export interface NumberInputProps extends InputBaseProps, Omit<InputWrapperProps, 'multiline' | 'resize' | 'id'> {
	/** Minimum possible value */
	min?: number

	/** Maximum possible value */
	max?: number

	/** Number by which value will be incremented/decremented with up/down controls and keyboard arrows, `1` by default */
	step?: number

	/** Determines whether the up/down controls should be hidden, `false` by default */
	hideControls?: boolean
}

const {
	min = Number.MIN_SAFE_INTEGER,
	max = Number.MAX_SAFE_INTEGER,
	step = 1,
	hideControls,
	disabled,
	readonly,
	rightSectionPE = 'all',
	...rest
} = defineProps<NumberInputProps>()
const id = useId()
const value = defineModel<number>({ default: 0 })

const { count, inc, dec, set } = useCounter(value, { min, max })

const focused = shallowRef<boolean>(false)

watch(count, () => {
	value.value = count.value
})

function handleWheel(event: WheelEvent) {
	if (!focused.value)
		return

	// if on a trackpad, users can scroll in both X and Y at once, check the magnitude of the change
	// if it's mostly in the X direction, then just return, the user probably doesn't mean to inc/dec
	// this isn't perfect, events come in fast with small deltas and a part of the scroll may give a false indication
	// especially if the user is scrolling near 45deg
	if (Math.abs(event.deltaY) <= Math.abs(event.deltaX))
		return

	if (event.deltaY > 0)
		dec(step)
	else if (event.deltaY < 0)
		inc(step)
}

function handleBlur() {
	focused.value = false
	set(clamp(count.value, min, max))
}
</script>

<template>
	<InputWrapper v-bind='rest' :id :class='$style.root' :right-section-p-e>
		<BaseInput
			:id
			:value='count'
			:readonly
			:disabled
			:step
			:min
			:max
			type='number'
			@focus='focused = true'
			@blur='handleBlur()'
			@wheel.prevent='handleWheel'
		>
			<template v-if='$slots?.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>
			<template #rightSection>
				<slot name='rightSection'>
					<div v-if='!hideControls' :class='$style.controls'>
						<UnstyledButton
							:class='$style.control'
							:disabled='disabled || (typeof value === "number" && !Number.isNaN(max) && value >= max!)'
							@click='inc(step)'
						>
							<Icon name='gravity-ui:chevron-up' />
						</UnstyledButton>
						<UnstyledButton
							:class='$style.control'
							:disabled='disabled || (typeof value === "number" && !Number.isNaN(min) && value <= min!)'
							@click='dec(step)'
						>
							<Icon name='gravity-ui:chevron-down' />
						</UnstyledButton>
					</div>
				</slot>
			</template>
		</BaseInput>
	</InputWrapper>
</template>

<style module lang='postcss'>
.root {
	--ni-right-section-width-xs: rem(17px);
	--ni-right-section-width-sm: rem(24px);
	--ni-right-section-width-md: rem(27px);
	--ni-right-section-width-lg: rem(31px);
	--ni-right-section-width-xl: rem(34px);
}

.controls {
	--ni-chevron-size-xs: rem(10px);
	--ni-chevron-size-sm: rem(14px);
	--ni-chevron-size-md: rem(16px);
	--ni-chevron-size-lg: rem(18px);
	--ni-chevron-size-xl: rem(20px);
	--ni-chevron-size: var(--ni-chevron-size-sm);

	display: flex;
	flex-direction: column;

	width: 100%;
	max-width: calc(var(--ni-chevron-size) * 1.7);
	height: calc(var(--input-height) - rem(2px));
	margin-inline-start: auto;
}

.control {
	--control-border: 1px solid var(--input-bd);
	--control-radius: calc(var(--input-radius) - rem(1px));

	cursor: pointer;

	display: flex;

	flex: 0 0 50%;
	align-items: center;
	justify-content: center;

	width: 100%;
	height: calc(var(--input-height) / 2 - rem(1px));
	padding: 0;
	border-inline-start: var(--control-border);

	color: var(--color-text);

	background-color: transparent;

	&:where(:disabled) {
		cursor: not-allowed;

		color: var(--color-disabled-text);

		opacity: 0.6;
		background-color: transparent;
	}

	.root[data-error] :where(&) {
		color: var(--color-error);
	}

	&:where(:first-of-type) {
		border-radius: 0;
		border-start-end-radius: var(--control-radius);
	}

	&:last-of-type {
		border-radius: 0;
		border-end-end-radius: var(--control-radius);
	}

	@mixin hover {
		@mixin where-light {
			background-color: var(--color-gray-0);
		}

		@mixin where-dark {
			background-color: var(--color-dark-4);
		}
	}
}
</style>
