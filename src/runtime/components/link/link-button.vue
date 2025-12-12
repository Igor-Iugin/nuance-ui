<script setup lang='ts'>
import type { NuxtLinkProps } from '#app'

import type { ButtonProps } from '../button'

import Button from '../button/button.vue'
import { pickLinkProps } from './lib'


export interface LinkButtonProps extends Omit<NuxtLinkProps, 'href' | 'custom'>, ButtonProps {
}

const props = defineProps<LinkButtonProps>()
const { link, rest } = pickLinkProps(props)
</script>

<template>
	<NuxtLink v-slot='{ href, navigate, ...linkProps }' v-bind='link' custom>
		<Button
			v-bind='{
				...rest,
				is: rest?.is || "a",
				href,
				rel: ("rel" in linkProps ? linkProps.rel : undefined),
				target: ("target" in linkProps ? linkProps.target : undefined),
			}'
			@click='navigate'
		>
			<template v-if='$slots.leftSection' #leftSection>
				<slot name='leftSection' />
			</template>

			<slot />

			<template v-if='$slots.rightSection' #rightSection>
				<slot name='rightSection' />
			</template>
		</Button>
	</NuxtLink>
</template>
