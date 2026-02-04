<script setup lang='ts'>
import type { NuanceSize } from '@nui/types'

import { getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../../../box.vue'

import UnstyledButton from '../../../button/unstyled-button.vue'


export interface CalendarCellProps extends BoxProps {
	size?: NuanceSize | string
}

const props = defineProps<CalendarCellProps>()

const style = computed(() => ({
	'--day-size': getSize(props.size),
}))
</script>

<template>
	<UnstyledButton v-bind='props' :style :class='$style.cell'>
		<slot	/>
	</UnstyledButton>
</template>

<style lang="postcss" module>
.cell {
	--day-size-xs: rem(30px);
	--day-size-sm: rem(36px);
	--day-size-md: rem(42px);
	--day-size-lg: rem(48px);
	--day-size-xl: rem(54px);
	--day-size: var(--day-size-sm);

	cursor: pointer;
	user-select: none;

	display: inline-flex;
	align-items: center;
	justify-content: center;

	width: var(--day-size, var(--day-size-sm));
	height: var(--day-size, var(--day-size-sm));
	border-radius: var(--radius-default);

	font-size: calc(var(--day-size) / 2.8);
	color: var(--color-text);

	background-color: transparent;

	&:hover {
		&:where(:not([data-static], &:disabled, [data-selected], [data-in-range])) {
			@mixin light {
				background-color: var(--color-gray-0);
			}

			@mixin dark {
				background-color: var(--color-dark-5);
			}
		}
	}

	&:where([data-static]) {
		cursor: default;
		user-select: auto;
	}

	&:where([data-weekend]) {
		color: var(--color-red-6);
	}

	&:where([data-outside]) {
		/* stylelint-disable-next-line function-no-unknown */
		color: alpha(var(--color-dimmed), .5);
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
		border-radius: 0;

		background-color: var(--color-primary-light-hover);

		&:hover {
			&:where(:not(:disabled, [data-static])) {
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
		border-start-end-radius: var(--radius-default);
		border-end-end-radius: var(--radius-default);
	}

	&:where([data-last-in-range][data-first-in-range]) {
		border-radius: var(--radius-default);
	}

	&:where([data-selected]) {
		color: var(--color-white);

		background-color: var(--color-primary-filled);

		&:hover {
			&:where(:not(:disabled, [data-static])) {
				background-color: var(--color-primary-filled-hover);
			}
		}
	}

	&:where(:disabled) {
		pointer-events: none;
		cursor: not-allowed;

		/* stylelint-disable-next-line function-no-unknown */
		color: alpha(var(--color-disabled), .5);
	}
}
</style>
