<script setup lang="ts" generic='Mode extends SelectionMode'>
import type { DateInput, Format } from '@formkit/tempo'

import { format } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'
import { computed } from 'vue'

import type { DateSelection, Selection, SelectionMode } from '../calendar'
import type { CalendarProps } from '../calendar/calendar.vue'
import type { ButtonInputProps } from './ui/button-input.vue'

import ActionIcon from '../action-icon/action-icon.vue'
import Badge from '../badge.vue'
import Calendar from '../calendar/calendar.vue'
import PopoverDropdown from '../popover/popover-dropdown.vue'
import PopoverTarget from '../popover/popover-target.vue'
import Popover from '../popover/popover.vue'
import ButtonInput from './ui/button-input.vue'


// TODO
/**
 * - presets
 */
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

/** ISO string(s) */
const model = defineModel<Selection | Selection[]>()

const config = useDatesConfig(cfg)
const formatValue = (date: DateInput) => format({ date, format: valueFormat, ...config	})

const visible = computed(() => {
	if (!model.value)
		return null

	switch (mode) {
		case 'single':
			return formatValue(model.value as string)
		case 'week':
		case 'range':{
			const [start, end] = model.value as string[]

			if (!start)
				return null

			if (end && start !== end)
				return `${formatValue(start)} - ${formatValue(end)}`
			else
				return formatValue(start)
		}
		case 'multiple':
			return (model.value as string[]).map(formatValue)
		default:
			return null
	}
})
</script>

<template>
	<Popover>
		<PopoverTarget>
			<ButtonInput v-bind='props' :multiline='mode === "multiple"'>
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
						v-for='(date, ix) in visible'
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
									model = (model as Selection[])!.filter((_, _ix) => _ix !== ix)
								}'
							/>
						</template>
					</Badge>
				</div>
				<template v-else>
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
				v-model:value='model as DateSelection<Mode>'
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
