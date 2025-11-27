<script lang='ts' setup>
import type { NuanceSize } from '@nui/types'

import { getFontSize, getSize } from '@nui/utils'
import { computed } from 'vue'

import type { BoxProps } from '../../box.vue'

import Box from '../../box.vue'


export interface InlineInputProps extends /* @vue-ignore */ Omit<BoxProps, 'is'> {
	id: string
	label?: string
	description?: string
	error?: string
	disabled?: boolean | undefined
	size?: NuanceSize | string
	labelPosition?: 'left' | 'right'
}

const {
	size,
	id,
	labelPosition = 'right',
	disabled,
	description,
	error,
	label,
	mod: _mod,
} = defineProps<InlineInputProps>()

const style = computed(() => ({
	'--label-fz': getFontSize(size),
	'--label-lh': getSize(size),
}))

const mod = computed(() => [
	{ 'label-position': labelPosition },
	_mod,
])
</script>

<template>
	<Box :style :class='$style.root' :mod>
		<div :class='$style.body'>
			<slot />

			<div :class='$style.wrapper'>
				<Box is='label' :class='$style.label' :for='id' :mod='{ disabled }'>
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
		</div>
	</Box>
</template>

<style lang='postcss' module>
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
