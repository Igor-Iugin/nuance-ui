<script setup lang='ts'>
import type { DateInput } from '@formkit/tempo'
import type { NuanceSize } from '@nui/types'

import { addMonth } from '@formkit/tempo'

import type { CalendarRootProps } from './ui/core'

import {
	CalendarGrid,
	CalendarHeader,
	CalendarRoot,
} from './ui/core'


export interface CalendarProps extends CalendarRootProps {
	/** Controls size */
	size?: NuanceSize

	/** Determines whether week numbers should be displayed @default `false` */
	withWeekNumbers?: boolean
}

const {
	withWeekNumbers,
	numberOfMonths = 1,
	size,
	...props
} = defineProps<CalendarProps>()

const date = defineModel<DateInput>('date', { required: true })
</script>

<template>
	<CalendarRoot
		v-slot='{ grid }'
		v-model:date='date'
		v-bind='props'
		:number-of-months
		:class='$style.content'
		@next='date = addMonth(date, numberOfMonths)'
		@prev='date = addMonth(date, -numberOfMonths)'
	>
		<section v-for='(month) in grid' :key='`table-${month.value.toString()}`'>
			<CalendarHeader :date='month.value' />

			<CalendarGrid :month :with-week-numbers :size />
		</section>
	</CalendarRoot>
</template>

<style lang="postcss" module>
.content {
	display: flex;
	gap: var(--spacing-sm);
	width: fit-content;
}

.weeknumber {
  --wn-size-xs: rem(30px);
  --wn-size-sm: rem(36px);
  --wn-size-md: rem(42px);
  --wn-size-lg: rem(48px);
  --wn-size-xl: rem(54px);

  color: var(--color-dimmed);
  font-weight: normal;
  font-size: calc(var(--wn-size, var(--wn-size-sm)) / 2.8);
  text-align: center;
  width: var(--wn-size, var(--wn-size-sm));
}

.weekday {
  color: var(--color-dimmed);
  font-weight: normal;
  font-size: var(--wr-fz, var(--font-size-sm));
  text-transform: capitalize;
  padding-bottom: calc(var(--wr-spacing, var(--spacing-sm)) / 2);
}
</style>
