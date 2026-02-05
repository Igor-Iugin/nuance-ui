import type { ModelRef } from 'vue'

import { computed, nextTick, ref, watch } from 'vue'

import type { TimePickerAmPmLabels, TimePickerFormat, TimePickerPasteSplit } from '../model'

import { clampTime } from './clamp-time'
import { getParsedTime } from './get-parsed-time'
import { getTimeString } from './get-time-string'


type TimeField = 'hours' | 'minutes' | 'seconds' | 'amPm'

export function useTimePicker({
	value,
	format,
	amPmLabels,
	withSeconds = false,
	min,
	max,
	readOnly,
	disabled,
	clearable,
	pasteSplit,
}: {
	value: ModelRef<string | undefined>
	format: TimePickerFormat
	amPmLabels: TimePickerAmPmLabels
	withSeconds?: boolean
	min?: string
	max?: string
	readOnly?: boolean
	disabled?: boolean
	clearable?: boolean
	pasteSplit?: TimePickerPasteSplit
}) {
	const parsedTime = computed(() => getParsedTime({
		time: value.value || '',
		amPmLabels,
		format,
	}))

	const initialTimeString = computed(() => getTimeString({
		hours: parsedTime.value.hours,
		minutes: parsedTime.value.minutes,
		seconds: parsedTime.value.seconds,
		format,
		withSeconds,
		amPm: parsedTime.value.amPm,
		amPmLabels,
	}))

	// Контроль синхронизации
	const acceptChange = ref(true)
	const wasInvalidBefore = ref(!initialTimeString.value.valid)

	// Внутреннее состояние компонента
	const hours = ref<number | null>(parsedTime.value.hours)
	const minutes = ref<number | null>(parsedTime.value.minutes)
	const seconds = ref<number | null>(parsedTime.value.seconds)
	const amPm = ref<string | null>(parsedTime.value.amPm)

	const isClearable = computed(() =>
		clearable
		&& !readOnly
		&& !disabled
		&& (hours.value !== null
			|| minutes.value !== null
			|| seconds.value !== null
			|| amPm.value !== null))

	const hiddenInputValue = computed(() => getTimeString({
		hours: hours.value,
		minutes: minutes.value,
		seconds: seconds.value,
		format,
		withSeconds,
		amPm: amPm.value,
		amPmLabels,
	}))

	// Template refs
	const hoursRef = ref<HTMLInputElement>()
	const minutesRef = ref<HTMLInputElement>()
	const secondsRef = ref<HTMLInputElement>()
	const amPmRef = ref<HTMLSelectElement>()
	const refMap = {
			hours: hoursRef,
			minutes: minutesRef,
			seconds: secondsRef,
			amPm: amPmRef,
		}

	const focus = (field: TimeField) => refMap[field].value?.focus()

	// Обработка изменения времени
	const handleTimeChange = (field: TimeField, val: number | string | null) => {
		const computedValue = {
			hours: hours.value,
			minutes: minutes.value,
			seconds: seconds.value,
			amPm: amPm.value,
			[field]: val,
		}

		const timeString = getTimeString({
			...computedValue,
			format,
			withSeconds,
			amPmLabels,
		})

		if (timeString.valid) {
			acceptChange.value = false
			wasInvalidBefore.value = false

			// Обновляем состояние
			if (field === 'hours')
				hours.value = val as number | null
			if (field === 'minutes')
				minutes.value = val as number | null
			if (field === 'seconds')
				seconds.value = val as number | null
			if (field === 'amPm')
				amPm.value = val as string | null

			// Обновляем ModelRef
			value.value = timeString.value
		}
		else {
			acceptChange.value = false
			if (!wasInvalidBefore.value) {
				value.value = ''
				wasInvalidBefore.value = true
			}
		}
	}

	// Установка времени из строки
	const setTimeString = (timeString: string) => {
		acceptChange.value = false

		const parsed = getParsedTime({ time: timeString, amPmLabels, format })
		hours.value = parsed.hours
		minutes.value = parsed.minutes
		seconds.value = parsed.seconds
		amPm.value = parsed.amPm

		const next = getTimeString({
			...parsed,
			format,
			withSeconds,
			amPmLabels,
		})
		wasInvalidBefore.value = !next.valid
		value.value = timeString
	}

	// Обработчики для каждого поля
	const setHours = (val: number | null) => {
		let adjustedValue = val

		// Для 12-часового формата
		if (format === '12h' && typeof val === 'number' && val > 12)
			adjustedValue = ((val - 1) % 12) + 1


		hours.value = adjustedValue
		handleTimeChange('hours', adjustedValue)
		focus('hours')
	}

	const setMinutes = (val: number | null) => {
		minutes.value = val
		handleTimeChange('minutes', val)
		focus('minutes')
	}

	const setSeconds = (val: number | null) => {
		seconds.value = val
		handleTimeChange('seconds', val)
		focus('seconds')
	}

	const setAmPm = (val: string | null) => {
		amPm.value = val
		handleTimeChange('amPm', val)
		focus('amPm')
	}

	// Очистка
	const clear = () => {
		acceptChange.value = false
		hours.value = null
		minutes.value = null
		seconds.value = null
		amPm.value = null
		value.value = ''
		wasInvalidBefore.value = true
		focus('hours')
	}

	// Обработка вставки
	const onPaste = (event: ClipboardEvent) => {
		event.preventDefault()
		const pastedValue = event.clipboardData?.getData('text')
		if (!pastedValue)
			return

		const parseFunc = pasteSplit || getParsedTime
		const parsed = parseFunc({
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

		if (timeString.valid) {
			acceptChange.value = false
			const clamped = clampTime(
				timeString.value,
				min || '00:00:00',
				max || '23:59:59',
			)

			value.value = clamped.timeString
			hours.value = parsed.hours
			minutes.value = parsed.minutes
			seconds.value = parsed.seconds
			amPm.value = parsed.amPm
		}
	}

	// Синхронизация с внешним значением (аналог useDidUpdate)
	watch(
		() => value.value,
		newValue => {
			// Если значение очищено извне
			if (newValue === '') {
				acceptChange.value = false
				hours.value = null
				minutes.value = null
				seconds.value = null
				amPm.value = null
				nextTick(() => {
					acceptChange.value = true
				})
				return
			}

			// Если изменение пришло извне (не от нашего компонента)
			if (acceptChange.value && typeof newValue === 'string') {
				const parsed = getParsedTime({
					time: newValue || '',
					amPmLabels,
					format,
				})
				hours.value = parsed.hours
				minutes.value = parsed.minutes
				seconds.value = parsed.seconds
				amPm.value = parsed.amPm
			}

			acceptChange.value = true
		},
	)

	return {
		// Template refs
		refs: {
			hours: hoursRef,
			minutes: minutesRef,
			seconds: secondsRef,
			amPm: amPmRef,
		},
		// Значения
		values: {
			hours,
			minutes,
			seconds,
			amPm,
		},
		// Методы установки значений
		setHours,
		setMinutes,
		setSeconds,
		setAmPm,
		// Утилиты
		focus,
		clear,
		onPaste,
		setTimeString,

		isClearable,
		hiddenInputValue,
	}
}
