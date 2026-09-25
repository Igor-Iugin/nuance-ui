<script lang='ts'>
import type { NuxtLinkProps } from 'nuxt/app'


export interface LinkProviderProps {
	/** Link props picked by `pickLinkProps` — renders a `NuxtLink` when `to` is set */
	link: Partial<NuxtLinkProps>
}

export interface LinkProviderSlots {
	default: [props: {
		href?: string
		navigate?: (event: MouseEvent) => void
		rel?: string | null
		target?: string | null
		isActive: boolean
	}]
}
</script>

<script lang='ts' setup>
import { NuxtLink } from '#components'

import Renderless from '../renderless/renderless.vue'


defineOptions({ inheritAttrs: false })

defineProps<LinkProviderProps>()
defineSlots<LinkProviderSlots>()
</script>

<template>
	<NuxtLink
		v-if='link.to'
		v-slot='{ href, navigate, isActive, ...linkProps }'
		v-bind='link'
		custom
	>
		<Renderless v-bind='$attrs'>
			<slot
				:href
				:navigate
				:is-active
				:rel='"rel" in linkProps ? linkProps.rel : undefined'
				:target='"target" in linkProps ? linkProps.target : undefined'
			/>
		</Renderless>
	</NuxtLink>

	<Renderless v-else v-bind='$attrs'>
		<slot :is-active='false' />
	</Renderless>
</template>
