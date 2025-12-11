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
	<NuxtLink v-slot='slotProps' v-bind='link' custom>
		<Button
			v-bind='{
				...rest,
				is: rest?.is || "a",
				href: slotProps.href,
				rel: ("rel" in slotProps ? slotProps.rel : undefined),
				target: ("target" in slotProps ? slotProps.target : undefined),
			}'
			@click='(e: MouseEvent) => slotProps.navigate(e)'
		>
			<template #leftSection>
				<slot name='leftSection' />
			</template>

			<slot />

			<template #rightSection>
				<slot name='rightSection' />
			</template>
		</Button>
	</NuxtLink>
</template>
