<script setup lang='ts'>
import type { NuxtLinkProps } from '#app'

import { NuxtLink } from '#components'

import type { TextProps } from '../text.vue'

import Text from '../text.vue'
import { extractNuxtLinkProps } from './lib'


export interface LinkProps extends /* @vue-ignore */ Omit<NuxtLinkProps, 'href' | 'custom'>, Omit<TextProps, 'is'> {
	underline?: boolean
}

const props = defineProps<LinkProps>()
const { link, rest } = extractNuxtLinkProps(props)
</script>

<template>
	<!-- @vue-ignore	-->
	<NuxtLink
		v-slot='{ href, navigate, rel, target }'
		v-bind='link'
		custom
	>
		<Text
			is='a'
			:class='[$style.root, { [$style.underline]: rest.underline }]'
			v-bind='{
				...rest,
				href,
				rel,
				target,
			}'
			@click='(e: MouseEvent) => navigate(e)'
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
		&,
		&:hover {
			text-decoration: none;
		}
	}
}
</style>
