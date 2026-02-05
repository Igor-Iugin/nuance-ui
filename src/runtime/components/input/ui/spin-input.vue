<script setup lang='ts'>
import { clamp } from '@vueuse/core'
import { computed } from 'vue'

import { padTime } from '../../time-picker'


export interface SpinInputProps {
	min: number
	max: number
	step: number
	focusable?: boolean
	allowTemporaryZero?: boolean
	placeholder?: string
	readonly?: boolean
}

const {
	min,
	max,
	placeholder = '--',
	step,
	readonly,
	allowTemporaryZero = false,
} = defineProps<SpinInputProps>()

const emit = defineEmits<{
	next: []
	prev: []
}>()

const maxDigit = computed(() => Number(max.toFixed(0)[0]))

const model = defineModel<number | null>({ default: null })
const value = computed({
	get: () => model.value == null ? '' : padTime(model.value),
	set: (newValue: string) => {
		if (readonly)
			return

		const clearValue = newValue.replace(/\D/g, '')

		if (clearValue === '') {
			model.value = null
			return
		}

		const parsedValue = Number.parseInt(clearValue, 10)
		const clampedValue = (allowTemporaryZero && parsedValue === 0 && min > 0)
			? 0
			: clamp(parsedValue, min, max)

		model.value = clampedValue

		if (clampedValue > maxDigit.value || newValue.startsWith('00')) {
			emit('next')
		}
	},
})

const arrowsMax = computed(() => max + 1 - step)

function handleKeyDown(event: KeyboardEvent) {
	if (readonly)
		return


	if (event.key === '0' || event.key === 'Num0') {
		if (model.value === 0) {
			event.preventDefault()
			emit('next')
		}
	}

	if (event.key === 'Home') {
		event.preventDefault()
		model.value = min
	}

	if (event.key === 'End') {
		event.preventDefault()
		model.value = max
	}

	if (event.key === 'Backspace' || event.key === 'Delete') {
		event.preventDefault()

		if (model.value !== null) {
			model.value = null
		}
		else {
			emit('prev')
		}
	}

	if (event.key === 'ArrowRight') {
		event.preventDefault()
		emit('next')
	}

	if (event.key === 'ArrowLeft') {
		event.preventDefault()
		emit('prev')
	}

	if (event.key === 'ArrowUp') {
		event.preventDefault()
		const newValue = model.value === null ? min : clamp(model.value! + step, min, arrowsMax.value)
		model.value = newValue
	}

	if (event.key === 'ArrowDown') {
		event.preventDefault()
		const newValue = model.value === null ? arrowsMax.value : clamp(model.value! - step, min, arrowsMax.value)
		model.value = newValue
	}
}
</script>

<template>
	<input
		v-model='value'
		type='text'
		role='spinbutton'
		:aria-valuemin='min'
		:aria-valuemax='max'
		:aria-valuenow='value === null ? 0 : value'
		:data-empty='value === null || undefined'
		inputMode='numeric'
		:placeholder
		:readonly
		@keydown='handleKeyDown'
		@focus='($event?.target as HTMLInputElement).select()'
		@click.stop='($event?.target as HTMLInputElement).select()'
	>
</template>
