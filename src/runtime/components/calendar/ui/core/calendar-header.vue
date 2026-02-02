<script setup lang="ts">
import type { BoxProps } from '../../../box.vue'

import Box from '../../../box.vue'
import UnstyledButton from '../../../button/unstyled-button.vue'


export interface CalendarHeaderProps extends BoxProps {
	prevIcon?: string
	nextIcon?: string

	withPrev?: boolean
	withNext?: boolean

	nextDisabled?: () => boolean
	prevDisabled?: () => boolean

	/** Label disabled state  */
	disabled?: boolean
}

const {
	is = 'header',
	prevIcon = 'gravity-ui:chevron-left',
	nextIcon = 'gravity-ui:chevron-right',
	withPrev = true,
	withNext = true,
	nextDisabled,
	prevDisabled,
	disabled,
	...props
} = defineProps<CalendarHeaderProps>()

defineEmits<CalendarHeaderEmits>()

export interface CalendarHeaderEmits {
	prev: []
	level: []
	next: []
}
</script>

<template>
	<Box :is v-bind='props' :class='$style.header'>
		<UnstyledButton
			v-if='withPrev'
			aria-label='Previous page'
			:disabled='prevDisabled?.()'
			:class='$style.control'
			@click='$emit("prev")'
		>
			<Icon :name='prevIcon' :class='$style.icon' />
		</UnstyledButton>

		<UnstyledButton
			:disabled
			:class='$style.level'
			@click='$emit("level")'
		>
			<slot />
		</UnstyledButton>

		<UnstyledButton
			v-if='withNext'
			aria-label='Next page'
			:disabled='nextDisabled?.()'
			:class='$style.control'
			@click='$emit("next")'
		>
			<Icon :name='nextIcon' :class='$style.icon' />
		</UnstyledButton>
	</Box>
</template>

<style lang="postcss" module>
.header {
  --dch-control-size-xs: rem(30px);
  --dch-control-size-sm: rem(36px);
  --dch-control-size-md: rem(42px);
  --dch-control-size-lg: rem(48px);
  --dch-control-size-xl: rem(54px);
  --dch-control-size: var(--dch-control-size-sm);

  --dch-control-radius: var(--radius-default);

	display: flex;
}

.level,
.control {
	height: var(--dch-control-size);
	border-radius: var(--dch-control-radius);
	display: flex;
	justify-content: center;
	align-items: center;
	user-select: none;
	opacity: 1;
	cursor: pointer;

	&:where([data-static]) {
		cursor: default;
	}

	&:hover {
		&:where(:not([data-static], :disabled)) {
			@mixin light {
				background-color: var(--color-gray-0);
			}

			@mixin dark {
				background-color: var(--color-dark-5);
			}
		}
	}

	&:where(:disabled) {
		opacity: 0.2;
		cursor: not-allowed;
	}
}

.level {
  flex: 1;
  font-size: var(--dch-fz, var(--font-size-sm));
  font-weight: 500;
  text-transform: capitalize;
}

.control {
	width: var(--dch-control-size);
}

.icon {
	width: 60%;
	height: 60%;
}
</style>
