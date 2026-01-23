<script setup lang='ts'>
import type { DateInput, FormatOptions } from '@formkit/tempo'
import type { DateConfig } from '@nui/composals'

import { sameDay, format as tFormat } from '@formkit/tempo'
import { useDatesConfig } from '@nui/composals'

import type { BoxProps } from '../../box.vue'

import UnstyledButton from '../../button/unstyled-button.vue'


export interface CalendarDayProps extends BoxProps {
	/** Date that is displayed in `YYYY-MM-DD` format */
	date: DateInput

	/** Determines whether the day is considered to be a weekend @default `false` */
	weekend?: boolean

	/** Determines whether the day is outside of the current month @default `false` */
	outside?: boolean

	/** Determines whether the day is selected @default `false` */
	selected?: boolean

	/** Determines whether the day should not be displayed @default `false` */
	hidden?: boolean

	/** Determines whether the day is selected in range @default `false` */
	inRange?: boolean

	/** Determines whether the day is first in range selection @default `false` */
	firstInRange?: boolean

	/** Determines whether the day is last in range selection @default `false` */
	lastInRange?: boolean

	/** Determines whether today should be highlighted with a border @default `false` */
	highlightToday?: boolean

	disabled?: boolean

	format?: FormatOptions['format']
	/** `@formkit/tempo` locale config */
	config?: DateConfig
}

const {
	is,
	mod,
	date,
	hidden = false,
	outside = false,
	selected = false,
	weekend = false,
	firstInRange,
	highlightToday,
	inRange,
	lastInRange,
	disabled,
	config,
	format = 'D',
} = defineProps<CalendarDayProps>()

const cfg = config ?? useDatesConfig()
</script>

<template>
	<UnstyledButton
		:is
		:class='$style.day'
		:mod='[{
			hidden,
			"outside": !disabled && outside,
			"selected": !disabled && selected,
			"weekend": !disabled && !outside && weekend,
			"today": highlightToday && sameDay(date, new Date()),
			"first-in-range": !disabled && firstInRange,
			"in-range": !disabled && inRange,
			"last-in-range": !disabled && lastInRange,
		}, mod]'
		:disabled
	>
		<slot>
			{{ tFormat({ date, format, ...cfg }) }}
		</slot>
	</UnstyledButton>
</template>

<style module lang='postcss'>
.day {
  --day-size-xs: rem(30px);
  --day-size-sm: rem(36px);
  --day-size-md: rem(42px);
  --day-size-lg: rem(48px);
  --day-size-xl: rem(54px);
  --day-size: var(--day-size-sm);

  width: var(--day-size, var(--day-size-sm));
  height: var(--day-size, var(--day-size-sm));
  font-size: calc(var(--day-size) / 2.8);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  background-color: transparent;
  border-radius: var(--radius-default);
  color: var(--color-text);
  opacity: 1;

  @mixin hover {
    &:where(:not([data-static], [data-disabled], [data-selected], [data-in-range])) {
      @mixin light {
        background-color: var(--color-gray-0);
      }

      @mixin dark {
        background-color: var(--color-dark-5);
      }
    }
  }

  &:where([data-static]) {
    user-select: auto;
    cursor: default;
  }

  &:where([data-weekend]) {
    color: var(--color-red-6);
  }

  &:where([data-outside]) {
    color: var(--color-dimmed);
    opacity: 0.5;
  }

  &:where(:disabled) {
    color: var(--color-disabled-color);
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:where([data-hidden]) {
    display: none;
  }

  &:where([data-today]:not([data-selected], [data-in-range])) {
    @mixin where-light {
      border: 1px solid var(--color-gray-4);
    }

    @mixin where-dark {
      border: 1px solid var(--color-dark-4);
    }
  }

  &:where([data-in-range]) {
    background-color: var(--color-primary-light-hover);
    border-radius: 0;

    @mixin hover {
      &:where(:not([data-disabled], [data-static])) {
        background-color: var(--color-primary-light);
      }
    }
  }

  &:where([data-first-in-range]) {
    border-radius: 0;
    border-start-start-radius: var(--radius-default);
    border-end-start-radius: var(--radius-default);
  }

  &:where([data-last-in-range]) {
    border-radius: 0;
    border-end-end-radius: var(--radius-default);
    border-start-end-radius: var(--radius-default);
  }

  &:where([data-last-in-range][data-first-in-range]) {
    border-radius: var(--radius-default);
  }

  &:where([data-selected]) {
    background-color: var(--color-primary-filled);
    color: var(--color-primary-contrast);

    @mixin hover {
      &:where(:not([data-disabled], [data-static])) {
        background-color: var(--color-primary-filled-hover);
      }
    }
  }
}
</style>
