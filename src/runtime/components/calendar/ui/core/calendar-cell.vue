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
		user-select: auto;
		cursor: default;
	}

	&:where([data-weekend]) {
		color: var(--color-red-6);
	}

	&:where([data-outside]) {
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
		background-color: var(--color-primary-light-hover);
		border-radius: 0;

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
		border-end-end-radius: var(--radius-default);
		border-start-end-radius: var(--radius-default);
	}

	&:where([data-last-in-range][data-first-in-range]) {
		border-radius: var(--radius-default);
	}

	&:where([data-selected]) {
		background-color: var(--color-primary-filled);
		color: var(--color-primary-contrast);

		&:hover {
			&:where(:not(:disabled, [data-static])) {
				background-color: var(--color-primary-filled-hover);
			}
		}
	}

	&:where(:disabled) {
		color: alpha(var(--color-disabled), .5);
		cursor: not-allowed;
		pointer-events: none;
	}
}
</style>
