<script lang='ts' setup>
import type { Classes } from '@nui/types'

import { getFontSize, getRadius, getSize } from '@nui/utils'
import { computed } from 'vue'

import type { WrapperContext } from '../lib/input-wrapper.context'

import Box from '../../box.vue'
import { useInputWrapperState } from '../lib/input-wrapper.context'


export interface BaseInputProps extends Omit<WrapperContext, 'id'> {
	classes?: Classes<'root' | 'section'>
}

const {
	classes,
	...props
} = defineProps<BaseInputProps>()

defineSlots<{
	leftSection: []
	default: (props: { id: string, css: string }) => any
	rightSection: []
}>()

const api = computed(() => useInputWrapperState() ?? props)

const style = computed(() => ({
	'--input-height': getSize(api.value.size, 'input-height'),
	'--input-fz': getFontSize(api.value.size),
	'--input-radius': api.value.radius === undefined ? undefined : getRadius(api.value.radius),
	'--input-padding-y': api.value.multiline ? getSize(api.value.size, 'input-padding-y') : undefined,
	'--input-left-section-pointer-events': api.value.leftSectionPE,
	'--input-right-section-pointer-events': api.value.rightSectionPE,
	'--input-resize': api.value.resize,
}))
</script>

<template>
	<Box
		:style
		:class='[$style.root, classes?.root]'
		:mod='[{
			"with-left-section": !!$slots.leftSection,
			"with-right-section": !!$slots.rightSection,
			"variant": api.variant,
		}]'
	>
		<span
			v-if='$slots.leftSection'
			:class='[$style.section, classes?.section]'
			data-position='left'
		>
			<slot name='leftSection' />
		</span>

		<slot :id='api.id' :css='$style.input' />

		<span
			v-if='$slots.rightSection'
			:class='[$style.section, classes?.section]'
			data-position='right'
		>
			<slot name='rightSection' />
		</span>
	</Box>
</template>

<style lang='postcss' module>
.root {
	--input-height-xs: rem(30px);
	--input-height-sm: rem(36px);
	--input-height-md: rem(42px);
	--input-height-lg: rem(50px);
	--input-height-xl: rem(60px);

	--input-padding-y-xs: rem(5px);
	--input-padding-y-sm: rem(6px);
	--input-padding-y-md: rem(8px);
	--input-padding-y-lg: rem(10px);
	--input-padding-y-xl: rem(13px);

	--input-height: var(--input-height-sm);
	--input-radius: var(--radius-default);

	--input-cursor: text;
	--input-text-align: left;
	--input-line-height: calc(var(--input-height) - rem(2px));
	--input-padding: calc(var(--input-height) / 3);
	--input-padding-inline-start: var(--input-padding);
	--input-padding-inline-end: var(--input-padding);
	--input-placeholder-color: var(--color-placeholder);
	--input-color: var(--color-text);

	--input-left-section-width: calc(var(--input-height) - rem(2px));
	--input-right-section-width: calc(var(--input-height) - rem(2px));
	--input-left-section-pointer-events: none;
	--input-right-section-pointer-events: none;
	--input-left-section-size: var(--input-left-section-width);
	--input-right-section-size: var(--input-right-section-width);

	--input-fz: var(--font-size-sm);
	--input-size: var(--input-height);
	--input-resize: none;

	--section-y: 1px;
	--left-section-start: 1px;
	--left-section-border-radius: var(--input-radius) 0 0 var(--input-radius);

	--right-section-end: 1px;
	--right-section-border-radius: 0 var(--input-radius) var(--input-radius) 0;

	position: relative;

	&[data-variant='unstyled'] {
		--input-padding: 0;
		--input-padding-y: 0;
		--input-padding-inline-start: 0;
		--input-padding-inline-end: 0;
	}

	&[data-pointer] {
		--input-cursor: pointer;
	}

	&[data-multiline] {
		--input-padding-y-xs: 4.5px;
		--input-padding-y-sm: 5.5px;
		--input-padding-y-md: 7px;
		--input-padding-y-lg: 9.5px;
		--input-padding-y-xl: 13px;

		--input-size: auto;
		--input-line-height: var(--line-height);
		--input-padding-y: var(--input-padding-y-sm);
	}

	&[data-with-left-section] {
		--input-padding-inline-start: var(--input-left-section-size);
	}

	&[data-with-right-section] {
		--input-padding-inline-end: var(--input-right-section-size);
	}

	[data-color-scheme] &[data-error] {
		--input-color: var(--color-error);
		--input-placeholder-color: var(--color-error);
		--input-section-color: var(--color-error);

		&:not([data-variant='unstyled']) {
			--input-bd: var(--color-error);
		}
	}

	@mixin light {
		--input-disabled-bg: var(--color-gray-1);
		--input-disabled-color: var(--color-gray-6);

		&[data-variant='default'] {
			--input-bd: var(--color-gray-4);
			--input-bg: var(--color-white);
			--input-bd-focus: var(--color-primary-filled);
		}

		&[data-variant='filled'] {
			--input-bd: transparent;
			--input-bg: var(--color-gray-1);
			--input-bd-focus: var(--color-primary-filled);
		}

		&[data-variant='unstyled'] {
			--input-bd: transparent;
			--input-bg: transparent;
			--input-bd-focus: transparent;
		}
	}

	@mixin dark {
		--input-disabled-bg: var(--color-dark-6);
		--input-disabled-color: var(--color-dark-2);

		&[data-variant='default'] {
			--input-bd: var(--color-dark-4);
			--input-bg: var(--color-dark-6);
			--input-bd-focus: var(--color-primary-filled);
		}

		&[data-variant='filled'] {
			--input-bd: transparent;
			--input-bg: var(--color-dark-5);
			--input-bd-focus: var(--color-primary-filled);
		}

		&[data-variant='unstyled'] {
			--input-bd: transparent;
			--input-bg: transparent;
			--input-bd-focus: transparent;
		}
	}

	@mixin where-rtl {
		--input-text-align: right;
		--left-section-border-radius: 0 var(--input-radius) var(--input-radius) 0;
		--right-section-border-radius: var(--input-radius) 0 0 var(--input-radius);
	}
}

.input {
	cursor: var(--input-cursor);
	resize: var(--input-resize, none);

	overflow: var(--input-overflow);
	display: block;

	width: 100%;
	height: var(--input-size);
	min-height: var(--input-height);
	padding-top: var(--input-padding-y, 0rem);
	padding-bottom: var(--input-padding-y, 0rem);
	padding-inline-start: var(--input-padding-inline-start);
	padding-inline-end: var(--input-padding-inline-end);
	border: rem(1px) solid var(--input-bd);
	border-radius: var(--input-radius);

	font-family: var(--font-family), serif;
	font-size: var(--input-fz);
	line-height: var(--input-line-height);
	color: var(--input-color);

	text-align: var(--input-text-align);

	appearance: none;
	background-color: var(--input-bg);

	transition: border-color 100ms ease;
	-webkit-tap-highlight-color: transparent;

	/* Used as data attribute in Textarea component, does not have associated prop on the Input component */

	&[data-no-overflow] {
		--input-overflow: hidden;
	}

	&:focus,
	&:focus-within {
		--input-bd: var(--input-bd-focus);

		outline: none;

		[data-error] & {
			--input-bd: var(--color-error);
		}
	}

	&::placeholder {
		color: var(--input-placeholder-color);

		opacity: 1;
	}

	&::-webkit-inner-spin-button,
	&::-webkit-outer-spin-button,
	&::-webkit-search-decoration,
	&::-webkit-search-cancel-button,
	&::-webkit-search-results-button,
	&::-webkit-search-results-decoration {
		appearance: none;
	}

	&[type='number'] {
		-moz-appearance: textfield;
	}

	&:disabled,
	&[data-disabled] {
		cursor: not-allowed;

		color: var(--input-disabled-color);

		opacity: 0.6;
		background-color: var(--input-disabled-bg);
	}

	/* Required to be a separate selector to work in Firefox, can be merged with &:disabled once :has is supported */

	&:has(input:disabled) {
		cursor: not-allowed;

		color: var(--input-disabled-color);

		opacity: .6;
		background-color: var(--input-disabled-bg);
	}
}

.section {
	pointer-events: var(--section-pointer-events);

	position: absolute;
	z-index: 1;
	top: var(--section-y);
	bottom: var(--section-y);
	inset-inline-start: var(--section-start);
	inset-inline-end: var(--section-end);

	display: flex;
	align-items: center;
	justify-content: center;

	width: var(--section-size);

	border-radius: var(--section-border-radius);

	color: var(--input-section-color, var(--color-dimmed));

	&[data-position='right'] {
		--section-pointer-events: var(--input-right-section-pointer-events);
		--section-end: var(--right-section-end);
		--section-size: var(--input-right-section-size);
		--section-border-radius: var(--right-section-border-radius);
	}

	&[data-position='left'] {
		--section-pointer-events: var(--input-left-section-pointer-events);
		--section-start: var(--left-section-start);
		--section-size: var(--input-left-section-size);
		--section-border-radius: var(--left-section-border-radius);
	}
}
</style>
