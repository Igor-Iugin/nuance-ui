import type { ModelRef } from 'vue'

import { unrefElement } from '@vueuse/core'
import { computed, ref, shallowRef, watch } from 'vue'

import type { TimePickerAmPmLabels, TimePickerFormat, TimePickerPasteSplit } from '../model'

import { clampTime } from './clamp-time'
import { getParsedTime } from './get-parsed-time'
import { getTimeString } from './get-time-string'


type TimeField = 'hours' | 'minutes' | 'seconds' | 'amPm'

export function useTimePicker({
	model,
	format,
	amPmLabels,
	withSeconds = false,
	min = '00:00:00',
	max = '23:59:59',
	pasteSplit,
}: {
	model: ModelRef<string | undefined>
	format: TimePickerFormat
	amPmLabels: TimePickerAmPmLabels
	withSeconds?: boolean
	min?: string
	max?: string
	pasteSplit?: TimePickerPasteSplit
}) {
	const intermediate = ref<{
		hours: number | null
		minutes: number | null
		seconds: number | null
		amPm: string | null
	}>({
		hours: null,
		minutes: null,
		seconds: null,
		amPm: null,
	})

	const parsed = computed(() => getParsedTime({ time: model.value ?? '', format, amPmLabels }))

	/** Sync `intermediate` state with `parsed` value */
	watch(parsed, v => intermediate.value = v, { immediate: true })

	const updateModel = (field: TimeField, value: number | string | null) => {
		intermediate.value = { ...intermediate.value, [field]: value }

		const timeString = getTimeString({
			...intermediate.value,
			format,
			withSeconds,
			amPmLabels,
		})

		model.value = timeString.valid ? timeString.value : ''
	}

	// States
	const hours = computed({
		get: () => parsed.value.hours,
		set: (value: number | null) => {
			let adjustedValue = value

			if (format === '12h' && typeof value === 'number' && value > 12)
				adjustedValue = ((value - 1) % 12) + 1

			updateModel('hours', adjustedValue)
		},
	})

	const minutes = computed({
		get: () => parsed.value.minutes,
		set: (value: number | null) => updateModel('minutes', value),
	})

	const seconds = computed({
		get: () => parsed.value.seconds,
		set: (value: number | null) => updateModel('seconds', value),
	})

	const amPm = computed({
		get: () => parsed.value.amPm,
		set: (value: string | null) => updateModel('amPm', value),
	})

	// Refs
	const hoursRef = shallowRef<HTMLInputElement | null>(null)
	const minutesRef = shallowRef<HTMLInputElement | null>(null)
	const secondsRef = shallowRef<HTMLInputElement | null>(null)
	const amPmRef = shallowRef<HTMLSelectElement | null>(null)
	const refs = {
		hours: hoursRef,
		minutes: minutesRef,
		seconds: secondsRef,
		amPm: amPmRef,
	}
	const focus = (field: TimeField) => unrefElement(refs[field].value)?.focus()
	const clear = () => {
		model.value = ''
		focus('hours')
	}

	const onPaste = (event: ClipboardEvent) => {
		event.preventDefault()
		const pastedValue = event.clipboardData?.getData('text') ?? ''

		const parsed = (pasteSplit ?? getParsedTime)({
			time: pastedValue,
			format,
			amPmLabels,
		})
		const timeString = getTimeString({
			...parsed,
			format,
			withSeconds,
			amPmLabels,
		})

		if (timeString.valid)
			model.value = clampTime(timeString.value, min, max).timeString
	}

	return {
		values: {
			hours,
			minutes,
			seconds,
			amPm,
		},
		refs: {
			hoursRef,
			minutesRef,
			secondsRef,
			amPmRef,
		},
		focus,
		clear,
		onPaste,
	}
}
