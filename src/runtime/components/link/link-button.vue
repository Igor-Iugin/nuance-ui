<script setup lang='ts'>
import type { NuxtLinkProps } from '#app'

import type { ButtonProps } from '../button'

import Button from '../button/button.vue'
import { extractNuxtLinkProps } from './lib'


export interface LinkButtonProps extends Omit<NuxtLinkProps, 'href' | 'custom'>, ButtonProps {
}

const props = defineProps<LinkButtonProps>()
const { link, rest } = extractNuxtLinkProps(props)
</script>

<template>
	<!-- @vue-ignore	-->
	<NuxtLink
		v-slot='{ href, navigate, rel, target }'
		v-bind='link'
		custom
	>
		<Button
			v-bind='{ ...rest, is: rest?.is || "a", href, rel, target }'
			@click='(e: MouseEvent) => navigate(e)'
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
