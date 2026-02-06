<script setup lang="ts">
import type { Classes } from '@nui/types'

import { computed } from 'vue'

import type { InputBaseProps } from '../input'
import type { InputWrapperProps } from '../input/ui/input-wrapper.vue'
import type { TimePickerAmPmLabels, TimePickerFormat, TimePickerPasteSplit } from './model'

import ActionIcon from '../action-icon/action-icon.vue'
import InputBase from '../input/ui/input-base.vue'
import InputWrapper from '../input/ui/input-wrapper.vue'
import SpinInput from '../input/ui/spin-input.vue'
import { getParsedTime } from './lib/get-parsed-time'
import { useTimePicker } from './lib/use-time-picker'

// TODO
/**
 * - presets
 * - dropdown select
 * - am/pm select
 * - blur
 * - paste
 */
export interface TimePickerProps extends InputWrapperProps, InputBaseProps {
	/** Determines whether the clear button should be displayed @default `false` */
	clearable?: boolean

	/** `name` prop passed down to the hidden input */
	name?: string

	/** Min possible time value in `hh:mm:ss` format @default `00:00:00` */
	min?: string

	/** Max possible time value in `hh:mm:ss` format @default `23:59:59` */
	max?: string

	/** Time format, @default `24h` */
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

	/** A function to transform paste values, by default time in 24h format can be parsed on paste for example `23:34:22` */
	pasteSplit?: TimePickerPasteSplit

	/** Hours input placeholder, @default `--` */
	hoursPlaceholder?: string

	/** Minutes input placeholder, @default `--` */
	minutesPlaceholder?: string

	/** Seconds input placeholder, @default `--` */
	secondsPlaceholder?: string

	classes?: Classes<'root' | 'input' | 'section' | 'field'>
}

const {
	amPmLabels = { am: 'AM', pm: 'PM' },
	format = '24h',
	pasteSplit = getParsedTime,
	withSeconds = false,

	hoursPlaceholder,
	minutesPlaceholder,
	secondsPlaceholder,

	hoursInputLabel,
	minutesInputLabel,
	secondsInputLabel,

	hoursStep = 1,
	minutesStep = 1,
	secondsStep = 1,
	name,

	required,
	clearable,
	disabled,
	readonly,

	classes,

	rightSectionPE = 'all',
	...props
} = defineProps<TimePickerProps>()

const model = defineModel<string>({ default: '' })

const {
	values: {
		hours,
		minutes,
		seconds,
		amPm,
	},
	refs: { hoursRef, minutesRef, secondsRef },
	clear,
	focus,
} = useTimePicker({
	model,
	amPmLabels,
	format,
	max: props.max,
	min: props.min,
	withSeconds,
	pasteSplit,
})

const isClearable = computed(() => clearable && !readonly && !disabled && (
	hours.value !== null || minutes.value !== null	|| seconds.value !== null	|| amPm.value !== null
))
</script>

<template>
	<InputWrapper v-bind='props' :right-section-p-e :class='classes?.root'>
		<InputBase :classes='{ root: classes?.input, section: classes?.section }' @click='focus("hours")'>
			<template v-if='$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>

			<template #default='{ id, css }'>
				<div :class='css'>
					<div :class='$style.root' dir='ltr'>
						<div :class='$style.group'>
							<!-- Hours -->
							<SpinInput
								ref='hoursRef'
								v-model='hours'
								:min='0'
								:max='23'
								:step='hoursStep'
								:placeholder='hoursPlaceholder'
								:class='classes?.field'
								:aria-label='hoursInputLabel'
								@next='focus("minutes")'
							/>
							<span>:</span>
							<!-- Minutes -->
							<SpinInput
								ref='minutesRef'
								v-model='minutes'
								:min='0'
								:max='59'
								:step='minutesStep'
								:placeholder='minutesPlaceholder'
								:class='classes?.field'
								:aria-label='minutesInputLabel'
								@next='focus("seconds")'
								@prev='focus("hours")'
							/>
							<template v-if='withSeconds'>
								<span>:</span>
								<!-- Seconds -->
								<SpinInput
									v-if='withSeconds'
									ref='secondsRef'
									v-model='seconds'
									:min='0'
									:max='59'
									:step='secondsStep'
									:placeholder='secondsPlaceholder'
									:aria-label='secondsInputLabel'
									:class='classes?.field'
									@prev='focus("minutes")'
								/>
							</template>
						</div>
					</div>
				</div>
				<input
					:id
					v-model='model'
					:name
					type='hidden'
					:required
					:disabled
					:readonly
				>
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
						@click.stop='clear'
					/>
				</slot>
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
</style>
