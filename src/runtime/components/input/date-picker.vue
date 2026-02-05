<script setup lang="ts" generic='Mode extends SelectionMode'>
import type { DateInput, Format } from '@formkit/tempo'

import { format, parse, sameDay } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { computed, ref, watch } from 'vue'

import type { DateSelection, Selection, SelectionMode } from '../calendar'
import type { CalendarProps } from '../calendar/calendar.vue'
import type { ButtonInputProps } from './button-input.vue'

import ActionIcon from '../action-icon/action-icon.vue'
import Badge from '../badge.vue'
import Calendar from '../calendar/calendar.vue'
import PopoverDropdown from '../popover/popover-dropdown.vue'
import PopoverTarget from '../popover/popover-target.vue'
import Popover from '../popover/popover.vue'
import ButtonInput from './button-input.vue'

// TODO Add presets & add missing props & add `Presentation-Value Separation`
export interface DatePickerProps<Mode extends SelectionMode> extends CalendarProps<Mode>, ButtonInputProps {
	/** Tempo format for value */
	valueFormat?: Format
}

const {
	mode = 'single',
	valueFormat = 'short',

	// Calendar props
	fixedWeeks = false,
	withCellSpacing = false,
	hideOutsideDates = false,
	highlightToday = true,
	excludeDate,
	maxDate,
	minDate,
	minLevel,
	maxLevel,
	numberOfMonths,
	prevDisabled,
	nextDisabled,
	weekdayFormat,
	withWeekNumbers,
	config: cfg,
	...props
} = defineProps<DatePickerProps<Mode>>()
const config = computed(() => cfg ?? useDatesConfig())

const value = defineModel<string>()
const select = ref<DateSelection<Mode>>()

function formatValue(date: DateInput) {
	return format({ date, format: valueFormat, ...config.value	})
}

watch(select, date => {
	if (!date)
		return value.value = ''

	switch (mode) {
		case 'single':
			return value.value = formatValue(date as DateInput)
		case 'week':
		case 'range':{
			const [start, end] = date as DateSelection<'range'>

			if (!start)
				return

			if (end && start !== end)
				return value.value = `${formatValue(start)} - ${formatValue(end)}`
			else
				return value.value = formatValue(start)
		}
		case 'multiple':
			return value.value = (date as DateInput[]).map(d => formatValue(d)).join(', ')
	}
})

const items = computed(() => {
	if (!value.value || mode !== 'multiple')
		return []

	if (value.value.length === 0)
		return []

	return value.value.split(', ')
})
</script>

<template>
	<Popover>
		<PopoverTarget>
			<ButtonInput
				v-bind='props'
				v-model='value!'
				:multiline='mode === "multiple"'
				type='text'
			>
				<template #leftSection>
					<slot name='leftSection'>
						<Icon name='gravity-ui:calendar' />
					</slot>
				</template>
				<template v-if='!!$slots.rightSection' #rightSection>
					<slot name='rightSection' />
				</template>

				<div v-if='mode === "multiple"' :class='$style.list'>
					<Badge
						v-for='date in items'
						:key='date'
						variant='light'
						color='gray'
					>
						{{ date }}

						<template #rightSection>
							<ActionIcon
								icon='gravity-ui:xmark'
								variant='subtle'
								color='gray'
								size='xs'
								@click.stop.prevent='() => {
									select = (select as Selection[])
										?.filter(val => !sameDay(parse(date, valueFormat), val)) as DateSelection<Mode>
								}'
							/>
						</template>
					</Badge>
				</div>

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
				v-model:value='select'
				:mode
				:fixed-weeks
				:with-cell-spacing
				:exclude-date
				:hide-outside-dates
				:highlight-today
				:max-date
				:min-date
				:min-level
				:max-level
				:number-of-months
				:prev-disabled
				:next-disabled
				:weekday-format
				:with-week-numbers
				:config
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
