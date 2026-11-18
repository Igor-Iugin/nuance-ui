<script setup lang='ts'>
import { clamp, round } from 'es-toolkit'
import { shallowRef } from 'vue'

import type { InputWrapperProps } from './index'
import type { InputSectionProps, InputStateProps } from './types'

import { useConfig } from '../../composables'
import UnstyledButton from '../button/unstyled-button.vue'
import BaseInput from './ui/input-base.vue'
import InputWrapper from './ui/input-wrapper.vue'


export interface NumberInputProps extends
	InputStateProps, InputSectionProps, Omit<InputWrapperProps, 'multiline' | 'resize' | 'id'> {
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
	icon,
	prefix,
	rightSectionPE = 'all',
	trailingIcon,
	postfix,
	...rest
} = defineProps<NumberInputProps>()

const focused = shallowRef(false)
const { icons } = useConfig()

const value = defineModel<number>({ default: 0 })

function decimalPlaces(number: number) {
	const [coefficient = '', exponent = '0'] = String(number).split('e')
	return Math.max(0, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent))
}

function changeValue(direction: 1 | -1) {
	if (rest.disabled || rest.readonly)
		return

	const current = Number.isFinite(value.value) ? value.value : 0
	const precision = Math.max(decimalPlaces(current), decimalPlaces(step))
	const next = current + direction * step
	const normalized = Number.isSafeInteger(Math.round(next * 10 ** precision))
		? round(next, precision)
		: next
	value.value = clamp(normalized, min, max)
}

function handleWheel(event: WheelEvent) {
	if (!focused.value || Math.abs(event.deltaY) <= Math.abs(event.deltaX))
		return

	changeValue(event.deltaY > 0 ? 1 : -1)
}

function handleBlur() {
	focused.value = false
	value.value = clamp(value.value, min, max)
}
</script>

<template>
	<InputWrapper v-bind='rest' :class='$style.root' :right-section-p-e>
		<BaseInput
			:icon
			:prefix
			:trailing-icon='trailingIcon'
			:postfix
		>
			<template v-if='!!$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>

			<template #default='{ id, css }'>
				<input
					:id
					v-model='value'
					v-bind='{ ...$attrs, class: css }'
					:min
					:max
					:step
					type='number'
					@focus='focused = true'
					@blur='handleBlur()'
					@wheel.prevent='handleWheel'
					@keydown.up.prevent='changeValue(1)'
					@keydown.down.prevent='changeValue(-1)'
				>
			</template>

			<template
				v-if='!!$slots.rightSection || (!hideControls && !trailingIcon && !postfix)'
				#rightSection
			>
				<slot name='rightSection'>
					<div :class='$style.controls'>
						<UnstyledButton
							:class='$style.control'
							:disabled='disabled
								|| readonly
								|| (typeof value === "number" && value >= max)'
							@click='changeValue(1)'
						>
							<Icon :name='icons.chevronUp' />
						</UnstyledButton>
						<UnstyledButton
							:class='$style.control'
							:disabled='disabled
								|| readonly
								|| (typeof value === "number" && value <= min)'
							@click='changeValue(-1)'
						>
							<Icon :name='icons.chevronDown' />
						</UnstyledButton>
					</div>
				</slot>
			</template>
		</BaseInput>

		<template v-if='!!$slots.label' #label>
			<slot name='label' />
		</template>
		<template v-if='!!$slots.error' #error>
			<slot name='error' />
		</template>
		<template v-if='!!$slots.description' #description>
			<slot name='description' />
		</template>
	</InputWrapper>
</template>

<style module>
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
