<script setup lang='ts'>
import type { NuxtLinkProps } from '#app'

import { NuxtLink } from '#components'

import type { TextProps } from '../text.vue'

import Text from '../text.vue'
import { pickLinkProps } from './lib'


export interface LinkProps extends Omit<NuxtLinkProps, 'href' | 'custom'>, Omit<TextProps, 'is'> {
	underline?: boolean
}

defineOptions({ inheritAttrs: false })

const props = defineProps<LinkProps>()
const { link, rest: { underline, ...rest } } = pickLinkProps(props)
</script>

<template>
	<NuxtLink v-slot='{ href, navigate, ...linkProps }' v-bind='link' custom>
		<Text
			is='a'
			:class='[$style.root, { [$style.underline]: underline }]'
			v-bind='{
				...rest,
				...$attrs,
				href,
				rel: ("rel" in linkProps ? linkProps.rel : undefined),
				target: ("target" in linkProps ? linkProps.target : undefined),
			}'
			@click='navigate'
		>
			<slot />
		</Text>
	</NuxtLink>
</template>

<style module>
.root {
	cursor: pointer;

	display: inline;

	margin: 0;
	padding: 0;
	border: none;

	text-decoration: none;

	appearance: none;
	background-color: transparent;

	&:where([data-line-clamp]) {
		display: -webkit-box;
	}
}

.underline {
	text-decoration: underline;

	&:where([data-variant='gradient']) {
		&, &:hover {
			text-decoration: none;
		}
	}
}
</style>
