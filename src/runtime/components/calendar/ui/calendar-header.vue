<script setup lang="ts">
import type { NuanceSize } from '@nui/types'

import { getSize } from '@nui/utils'
import { computed } from 'vue'

import Box from '../../box.vue'
import UnstyledButton from '../../button/unstyled-button.vue'


export interface CalendarHeaderEmits {
	/** Called when the previous button is clicked */
	prev: []
	/** Called when the level button is clicked */
	level: []
	/** Called when the next button is clicked */
	next: []
}

export interface CalendarHeaderProps {
	/** Change next icon */
	nextIcon?: string

	/** Change previous icon */
	prevIcon?: string

	/** Next button `aria-label` */
	nextLabel?: string

	/** Previous button `aria-label` */
	prevLabel?: string

	/** Disables next control */
	nextDisabled?: boolean

	/** Disables previous control */
	prevDisabled?: boolean

	/** Determines whether next level button should be enabled @default `true` */
	hasNextLevel?: boolean

	/** Determines whether next control should be rendered @default `true` */
	withNext?: boolean

	/** Determines whether previous control should be rendered @default `true` */
	withPrev?: boolean

	/** Level control `aria-label` */
	levelControlAriaLabel?: string

	/** Component size */
	size?: NuanceSize
}

const {
	prevIcon = 'gravity-ui:chevron-left',
	prevLabel,
	prevDisabled,
	withPrev = true,

	nextIcon = 'gravity-ui:chevron-right',
	nextLabel,
	nextDisabled,
	withNext = true,

	hasNextLevel,
	levelControlAriaLabel,
	size,
} = defineProps<CalendarHeaderProps>()

defineEmits<CalendarHeaderEmits>()

const style = computed(() => ({
	'--dch-control-size': getSize(size, 'dch-control-size'),
}))
</script>

<template>
	<Box is='header' :class='$style.header' :style>
		<UnstyledButton
			v-if='withPrev'
			:aria-label='prevLabel'
			:mod='{ direction: "prev" }'
			:disabled='prevDisabled'
			:class='$style.control'
			:tab-index='prevDisabled ? -1 : 0'
			@click='$emit("prev")'
		>
			<Icon :name='prevIcon' :class='$style.icon' />
		</UnstyledButton>

		<UnstyledButton
			:component='hasNextLevel ? "button" : "div"'
			:disabled='!hasNextLevel'
			:class='$style.level'
			:mod='{ static: !hasNextLevel }'
			:aria-label='levelControlAriaLabel'
			:tab-index='hasNextLevel ? 0 : -1'
			@click='$emit("level")'
		>
			<slot />
		</UnstyledButton>

		<UnstyledButton
			v-if='withNext'
			:aria-label='nextLabel'
			:mod='{ direction: "next" }'
			:disabled='nextDisabled'
			:class='$style.control'
			:tab-index='nextDisabled ? -1 : 0'
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

	display: flex;
	max-width: calc(var(--dch-control-size) * 8 + rem(7px));
	margin-bottom: var(--spacing-xs);
}

.level,
.control {
	height: var(--dch-control-size);
	border-radius: var(--radius-default);
	display: flex;
	justify-content: center;
	align-items: center;
	user-select: none;
	opacity: 1;
	cursor: pointer;

	&:where([data-static]) {
		cursor: default;
	}

	@mixin hover {
		&:where(:not([data-disabled], [data-static], :disabled)) {
			@mixin light {
				background-color: var(--color-gray-0);
			}

			@mixin dark {
				background-color: var(--color-dark-5);
			}
		}
	}

	&:where(:disabled, [data-disabled]) {
		opacity: 0.2;
		cursor: not-allowed;
	}
}

.control {
	width: var(--dch-control-size);
}

.level {
	flex: 1;
	font-size: var(--dch-fz, var(--font-size-sm));
	font-weight: 500;
	text-transform: capitalize;
}

.icon {
	width: 60%;
	height: 60%;
}
</style>
