<script setup lang="ts">
import type { Format } from '@formkit/tempo'

import { format } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { computed } from 'vue'

import type { DateSelection } from './calendar'
import type { CalendarProps } from './calendar/calendar.vue'
import type { ButtonInputProps } from './input/ui/button-input.vue'
import type { TimePickerProps } from './time-picker/time-picker.vue'

import ActionIcon from './action-icon/action-icon.vue'
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
export interface DatePickerProps extends ButtonInputProps, Pick<TimePickerProps, 'withSeconds'> {
	/** Tempo format for date value @default `DD.MM.YYYY HH:mm` */
	format?: Format

	calendarProps?: Partial<Omit<CalendarProps, 'numberOfMonths' | 'mode'>>
	timePickerProps?: Omit<Partial<TimePickerProps>, 'withSeconds' | 'name'>

	clearable?: boolean
}

const {
	format: lFormat,
	calendarProps,
	timePickerProps,

	rightSectionPE = 'all',

	withSeconds = false,
	clearable = false,

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
const visible = computed(() => {
	if (!model.value)
		return null

	const _format = lFormat ?? withSeconds ? 'DD.MM.YYYY HH:mm:ss' : 'DD.MM.YYYY HH:mm'
	return format({ date: model.value, format: _format, ...config })
})

const isClearable = computed(() => clearable && !props.disabled && !props.readonly && !!model.value)
</script>

<template>
	<Popover>
		<PopoverTarget>
			<ButtonInput v-bind='props' :right-section-p-e>
				<template #leftSection>
					<slot name='leftSection'>
						<Icon name='gravity-ui:calendar' />
					</slot>
				</template>

				<template
					v-if='(!$slots.rightSection && isClearable) || !!$slots.rightSection'
					#rightSection
				>
					<slot name='rightSection'>
						<ActionIcon
							icon='gravity-ui:xmark'
							variant='subtle'
							color='gray'
							size='sm'
							@click.stop='model = ""'
						/>
					</slot>
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
			<Calendar
				v-model:value='date'
				v-bind='calendarProps'
			/>
			<TimePicker
				v-model='time'
				v-bind='timePickerProps'
				:with-seconds
				:clearable
			/>
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
