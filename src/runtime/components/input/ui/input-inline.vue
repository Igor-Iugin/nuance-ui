<script lang='ts' setup>
import type { AnyString, NuanceSize } from '@nui/types'

import { getFontSize, getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../../box.vue'

import Box from '../../box.vue'


export interface InlineInputProps extends BoxProps {
	/** Input id */
	id: string

	/** Label text */
	label?: string

	/** Helper text displayed below the label */
	description?: string

	/** Error message displayed below the label */
	error?: string

	/** Disables the component */
	disabled?: boolean | undefined

	/** Component size */
	size?: NuanceSize | AnyString

	/** Position of the label relative to the input control */
	labelPosition?: 'left' | 'right'

	/** HTML element used for the body wrapper */
	bodyElement?: keyof HTMLElementTagNameMap

	/** HTML element used for the label */
	labelElement?: keyof HTMLElementTagNameMap
}

const {
	size,
	id,
	labelPosition = 'right',
	disabled,
	description,
	error,
	label,
	mod,
	bodyElement = 'div',
	labelElement = 'label',
} = defineProps<InlineInputProps>()

const style = computed(() => ({
	'--label-fz': getFontSize(size),
	'--label-lh': getSize(size, 'label-lh'),
}))
</script>

<template>
	<Box :style :class='$style.root' :mod='[{ "label-position": labelPosition }, mod]'>
		<Box :is='bodyElement' :for='bodyElement === "label" ? id : undefined' :class='$style.body'>
			<slot />

			<div :class='$style.wrapper'>
				<Box :is='labelElement' v-if='label || $slots.label' :class='$style.label' :for='labelElement === "label" ? id : undefined' :mod='{ disabled }'>
					<slot name='label'>
						{{ label }}
					</slot>
				</Box>

				<Box is='p' v-if='error' :class='$style.error' :mod='{ disabled }'>
					<slot name='error'>
						{{ error }}
					</slot>
				</Box>

				<Box is='p' v-else-if='description || $slots.description' :class='$style.description' :mod='{ disabled }'>
					<slot name='description'>
						{{ description }}
					</slot>
				</Box>
			</div>
		</Box>
	</Box>
</template>

<style module>
.root {
	--label-lh-xs: rem(16px);
	--label-lh-sm: rem(20px);
	--label-lh-md: rem(24px);
	--label-lh-lg: rem(30px);
	--label-lh-xl: rem(36px);
	--label-lh: var(--label-lh-sm);

	--label-fz: var(--font-size-sm);

	&[data-label-position='left'] {
		--label-order: 0;
	}

	&[data-label-position='right'] {
		--label-order: 1;
	}
}

.body {
	display: flex;
	gap: var(--spacing-sm);
}

.wrapper {
	--label-cursor: default;

	cursor: var(--label-cursor);

	display: inline-flex;
	flex-direction: column;
	gap: .25rem;
	order: var(--label-order);

	font-size: var(--label-fz);
	line-height: var(--label-lh);

	-webkit-tap-highlight-color: transparent;

	fieldset:disabled &,
	&[data-disabled] {
		--label-cursor: not-allowed;
	}

	&:empty {
		display: none;
	}
}

.label {
	cursor: var(--label-cursor);

	color: inherit;

	fieldset:disabled &,
	&:where([data-disabled]) {
		color: var(--color-gray-5);
	}
}

.error,
.description {
	display: block;

	margin: 0;
	padding: 0;

	line-height: 1.2;
	overflow-wrap: break-word;
}

.description {
	font-size: var(--input-description-size, calc(var(--font-size-sm) - rem(2px)));
	color: var(--color-dimmed);
}

.error {
	font-size: var(--input-error-size);
	color: var(--color-error);
}
</style>
