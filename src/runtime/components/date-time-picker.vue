<script setup lang="ts">
import type { Format } from '@formkit/tempo'

import { format } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { computed } from 'vue'

import type { DateSelection } from './calendar'
import type { CalendarProps } from './calendar/calendar.vue'
import type { ButtonInputProps } from './input/ui/button-input.vue'
import type { TimePickerProps } from './time-picker/time-picker.vue'

import Calendar from './calendar/calendar.vue'
import ButtonInput from './input/ui/button-input.vue'
import PopoverDropdown from './popover/popover-dropdown.vue'
import PopoverTarget from './popover/popover-target.vue'
import Popover from './popover/popover.vue'
import { splitTimeString } from './time-picker'
import TimePicker from './time-picker/time-picker.vue'


// TODO
/**
 * - presets
 * - separate props for time-picker, calendar, input
 * - clearable
 */

export interface DatePickerProps extends ButtonInputProps {
	/** Tempo format for date value @default `DD.MM.YYYY HH:mm` */
	format?: Format

	timePickerProps?: Partial<TimePickerProps>
	calendarProps?: Partial<Omit<CalendarProps, 'numberOfMonths' | 'mode'>>
}

const {
	format: lFormat = 'DD.MM.YYYY HH:mm',

	timePickerProps,
	calendarProps,

	...props
} = defineProps<DatePickerProps>()

/** ISO string */
const model = defineModel<string | Date>()

const date = computed({
	get: () => model.value ? format(model.value, 'YYYY-MM-DD') : '',
	set: (value: DateSelection) => {
		if (!value)
			return model.value = ''

		const current = model.value ? new Date(model.value) : null
		const newDate = new Date(value)

		if (current) {
			newDate.setHours(current.getHours())
			newDate.setMinutes(current.getMinutes())
			newDate.setSeconds(current.getSeconds())
			newDate.setMilliseconds(current.getMilliseconds())
		}
		else {
			newDate.setHours(0, 0, 0, 0)
		}

		model.value = newDate.toISOString()
	},
})

const time = computed({
	get: () => model.value ? format(model.value, 'HH:mm:ss') : '',
	set: (value: string) => {
		if (!value) {
			if (model.value) {
				const current = new Date(model.value)
				current.setHours(0, 0, 0, 0)
				model.value = current.toISOString()
			}

			return
		}

		const date = model.value ? new Date(model.value) : new Date()
		const { hours, minutes, seconds } = splitTimeString(value)

		date.setHours(hours ?? 0, minutes ?? 0, seconds ?? 0, 0)
		model.value = date.toISOString()
	},
})

const config = useDatesConfig(calendarProps?.config)
const visible = computed(() => model.value ? format({ date: model.value, format: lFormat, ...config }) : null)
</script>

<template>
	<Popover>
		<PopoverTarget>
			<ButtonInput v-bind='props'>
				<template #leftSection>
					<slot name='leftSection'>
						<Icon name='gravity-ui:calendar' />
					</slot>
				</template>
				<template v-if='!!$slots.rightSection' #rightSection>
					<slot name='rightSection' />
				</template>

				<template #default>
					{{ visible }}
				</template>

				<template v-if='!!$slots.label' #label>
					<slot name='label' />
				</template>
				<template v-if='!!$slots.error' #error>
					<slot name='error' />
				</template>
				<template v-if='!!$slots.description' #description>
					<slot name='description' />
				</template>
			</ButtonInput>
		</PopoverTarget>
		<PopoverDropdown>
			<Calendar v-model:value='date' v-bind='calendarProps' />
			<TimePicker
				v-model='time'
				v-bind='timePickerProps'
			>
				<template #leftSection>
					<Icon name='gravity-ui:clock' />
				</template>
			</TimePicker>
		</PopoverDropdown>
	</Popover>
</template>

<style lang="postcss" module>
.list {
	display: flex;
	flex-wrap: wrap;
	gap: .25rem;
}
</style>
