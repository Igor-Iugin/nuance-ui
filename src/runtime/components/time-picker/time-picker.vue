<script setup lang="ts">
import type { Classes } from '@nui/types'

import type { InputBaseProps } from '../input'
import type { InputWrapperProps } from '../input/ui/input-wrapper.vue'
import type { TimePickerAmPmLabels, TimePickerFormat, TimePickerPasteSplit } from './model'

import InputBase from '../input/ui/input-base.vue'
import InputWrapper from '../input/ui/input-wrapper.vue'
import SpinInput from '../input/ui/spin-input.vue'


export interface TimePickerProps extends InputWrapperProps, InputBaseProps {
	/** Determines whether the clear button should be displayed @default `false` */
	clearable?: boolean

	/** `name` prop passed down to the hidden input */
	name?: string

	/** Min possible time value in `hh:mm:ss` format */
	min?: string

	/** Max possible time value in `hh:mm:ss` format */
	max?: string

	/** Time format, `'24h'` by default */
	format?: TimePickerFormat

	/** Number by which hours are incremented/decremented @default `1` */
	hoursStep?: number

	/** Number by which minutes are incremented/decremented @default `1` */
	minutesStep?: number

	/** Number by which seconds are incremented/decremented @default `1` */
	secondsStep?: number

	/** Determines whether the seconds input should be displayed @default `false` */
	withSeconds?: boolean

	/** `aria-label` of hours input */
	hoursInputLabel?: string

	/** `aria-label` of minutes input */
	minutesInputLabel?: string

	/** `aria-label` of seconds input */
	secondsInputLabel?: string

	/** `aria-label` of am/pm input */
	amPmInputLabel?: string

	/** Labels used for am/pm values @default `{ am: 'AM', pm: 'PM' }` */
	amPmLabels?: TimePickerAmPmLabels

	/** Determines whether the dropdown with time controls list should be visible when the input has focus @default `false` */
	withDropdown?: boolean

	/** If set, the value cannot be updated */
	readOnly?: boolean

	/** If set, the component becomes disabled */
	disabled?: boolean

	/** A function to transform paste values, by default time in 24h format can be parsed on paste for example `23:34:22` */
	pasteSplit?: TimePickerPasteSplit

	/** Maximum height of the content displayed in the dropdown in px @default `200` */
	maxDropdownContentHeight?: number

	/** If set, the time controls list are reversed, @default `false` */
	reverseTimeControlsList?: boolean

	/** Hours input placeholder, @default `--` */
	hoursPlaceholder?: string

	/** Minutes input placeholder, @default `--` */
	minutesPlaceholder?: string

	/** Seconds input placeholder, @default `--` */
	secondsPlaceholder?: string

	classes?: Classes<'wrapper' | 'input'>
}

const props = defineProps<TimePickerProps>()

const value = defineModel<string>()
</script>

<template>
	<InputWrapper v-bind='props' :class='[$attrs.class]'>
		<InputBase>
			<template v-if='$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>

			<template #default='{ id, css }'>
				<div :class='css'>
					<div :class='$style.root' dir='ltr'>
						<div :class='$style.group'>
							<!-- Hours -->
							<SpinInput
								:min='0'
								:max='23'
								:step='1'
								:class='$style.field'
							/>
							<span>:</span>
							<!-- Minutes -->
							<SpinInput
								:min='0'
								:max='59'
								:step='1'
								:class='$style.field'
							/>
							<!-- Seconds -->
							<SpinInput
								v-if='withSeconds'
								:min='0'
								:max='59'
								:step='1'
								:class='$style.field'
							/>
						</div>
					</div>
				</div>
				<input
					v-bind='{ ...$attrs, class: css }'
					:id
					v-model='value'
					type='hidden'
					:required='props.required'
					:disabled='props.disabled'
					:readonly='props.readonly'
				>
			</template>

			<template v-if='$slots.rightSection' #rightSection>
				<slot name='rightSection' />
			</template>
		</InputBase>

		<template v-if='$slots.label' #label>
			<slot name='label' />
		</template>
		<template v-if='$slots.error' #error>
			<slot name='error' />
		</template>
		<template v-if='$slots.description' #description>
			<slot name='description' />
		</template>
	</InputWrapper>
</template>

<style lang="postcss" module>
.root {
	overflow: hidden;
	display: flex;
	align-items: center;

	height: 100%;

	@mixin where-rtl {
		flex-direction: row-reverse;
	}
}

.group {
	display: flex;
	align-items: center;

	height: calc(var(--input-height) - rem(15px));
}

.controls {
	display: flex;
	flex-direction: column;
}

.controlsGroup {
	display: flex;
	gap: .25rem;
}

.dropdown {
	padding: .25rem;
}

.control {
	width: max-content;
	min-width: 2.5em;
	height: 2em;
	border-radius: var(--radius-default);

	font-size: var(--control-font-size, var(--font-size-sm));
	text-align: center;

	&:where([data-active]) {
		color: var(--color-white);

		background-color: var(--color-primary-filled);
	}

	@mixin hover {
		&:where(:not([data-active])) {
			color: var(--color-bright);

			@mixin where-dark {
				background-color: var(--color-dark-5);
			}

			@mixin where-light {
				background-color: var(--color-gray-1);
			}
		}
	}
}

.presetControl {
	height: 2em;
	padding-inline: 0.5em;
	border-radius: var(--radius-default);

	font-size: var(--control-font-size, var(--font-size-sm));
	text-align: center;

	&:where([data-active]) {
		color: var(--color-white);

		background-color: var(--color-primary-filled);
	}

	@mixin hover {
		&:where(:not([data-active])) {
			color: var(--color-bright);

			@mixin where-dark {
				background-color: var(--color-dark-5);
			}

			@mixin where-light {
				background-color: var(--color-gray-1);
			}
		}
	}
}

.presetsGroup {
	&+& {
		margin-top: var(--spacing-sm);
	}
}

.presetsGroupLabel {
	display: flex;
	align-items: center;

	margin-bottom: .25rem;
	padding-inline-start: 7px;

	font-size: calc(var(--control-font-size, var(--font-size-sm)) - 2px);
	font-weight: 500;
	color: var(--color-dimmed);

	&::after {
		content: '';

		flex: 1;

		width: 100%;
		height: 1px;
		margin-inline-start: var(--spacing-xs);

		@mixin where-light {
			background-color: var(--color-gray-2);
		}

		@mixin where-dark {
			background-color: var(--color-dark-4);
		}
	}
}

.field {
	position: relative;

	width: calc(2ch + 0.3em);
	height: 100%;
	padding-inline: 0.15em;
	border: 0;
	border-radius: 2px;

	font-variant-numeric: tabular-nums;
	line-height: 1;
	color: var(--input-color);
	text-align: center;
	text-align-last: center;

	appearance: none;
	background-color: transparent;
	caret-color: transparent;

	&:where([data-am-pm]) {
		width: auto;
	}

	&:where(:disabled) {
		cursor: not-allowed;
	}

	&::selection {
		background-color: transparent;
	}

	&::placeholder {
		color: inherit;

		opacity: 1;
	}

	&:focus {
		color: var(--color-white);

		background-color: var(--color-primary-filled);
		outline: 0;

		&::placeholder {
			color: var(--color-white);
		}
	}
}
</style>
