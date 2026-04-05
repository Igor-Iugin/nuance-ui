<script setup lang='ts'>
import type { ActionIconProps } from '@nui/components'
import type { NuanceColor } from '@nui/types'
import type { NuxtLinkProps } from 'nuxt/app'

import ActionIcon from '../action-icon/action-icon.vue'
import { pickLinkProps } from '../link'


export interface NavIconLinkProps extends ActionIconProps, Omit<NuxtLinkProps, 'href' | 'custom'> {
	/** Link target */
	to: NuxtLinkProps['to']

	/** Color from theme */
	color?: NuanceColor

	/** Icon name shorthand */
	icon?: string

	/**
	 * Variant applied in active state
	 * @default `'filled'`
	 */
	active?: ActionIconProps['variant']

	/**
	 * Variant applied in inactive state
	 * @default `'default'`
	 */
	notActive?: ActionIconProps['variant']
}

defineOptions({ inheritAttrs: false })

const {
	active = 'filled',
	notActive = 'default',
	mod,
	...etc
} = defineProps<NavIconLinkProps>()

const { link, rest } = pickLinkProps(etc)
</script>

<template>
	<NuxtLink v-slot='{ href, navigate, isActive, ...linkProps }' v-bind='link' custom>
		<ActionIcon
			is='a'
			v-bind='{ ...rest, ...$attrs }'
			:href
			:variant='isActive ? active : notActive'
			:mod='[{ active: isActive }, mod]'
			:aria-current="isActive ? 'page' : undefined"
			:rel='("rel" in linkProps) ? linkProps?.rel : undefined'
			:target='("target" in linkProps) ? linkProps?.target : undefined'
			@click='navigate'
		>
			<slot />
		</ActionIcon>
	</NuxtLink>
</template>
