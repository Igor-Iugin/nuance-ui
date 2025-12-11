<script setup lang='ts'>
import type { NuanceSpacing } from '@nui/types'
import type { MaybeRef } from 'vue'

import { getSpacing } from '@nui/utils'
import { computed, unref } from 'vue'

import type { BoxProps } from './box.vue'
import type { LinkProps } from './link'

import Box from './box.vue'
import Button from './button/button.vue'
import { pickLinkProps } from './link'


export interface BreadcrumbsItem extends Omit<LinkProps, 'mod'> {
	label: string
	icon?: string
	class?: string
	slot?: string
}

export interface BreadcrumbsProps extends BoxProps {
	items?: MaybeRef<BreadcrumbsItem[]>

	/** Separator icon between items @default `'gravity-ui:chevron-right'` */
	separator?: string

	/** Controls spacing between separator and breadcrumb @default `'xs'` */
	spacing?: NuanceSpacing
}

const {
	is = 'ol',
	mod,
	spacing,
	separator = 'gravity-ui:chevron-right',
} = defineProps<BreadcrumbsProps>()

const style = computed(() => ({
	'--bc-spacing': getSpacing(spacing),
}))
</script>

<template>
	<Box
		:is
		:mod
		:style
		:class='$style.root'
		aria-label='breadcrumb'
	>
		<template v-for='(item, ix) in unref(items)' :key='ix'>
			<li :class='$style.breadcrumb'>
				<NuxtLink v-slot='{ isActive }' v-bind='pickLinkProps(item).link' custom>
					<span :aria-current='isActive'>
						<slot :name='item.slot ?? "item"'>
							<Button>
								{{ item.label }}
							</Button>
						</slot>
					</span>
				</NuxtLink>
			</li>
			<li
				v-if='ix < unref(items)!.length'
				role='presentation'
				aria-hidden='true'
				:class='$style.separator'
			>
				<slot name='separator'>
					<Icon :name='separator' />
				</slot>
			</li>
		</template>
	</Box>
</template>

<style module lang='postcss'>
.root {
	--bc-spacing: var(--spacing-xs);

	display: flex;
	flex-wrap: wrap;
	gap: var(--bc-spacing);
	align-items: center;
}

.breadcrumb {
	line-height: 1;
	white-space: nowrap;
	-webkit-tap-highlight-color: transparent;
}

.separator {
	display: flex;
	align-items: center;
	justify-content: center;

	margin-inline: var(--bc-spacing);

	line-height: 1;

	@mixin where-light {
		color: var(--color-gray-7);
	}

	@mixin where-dark {
		color: var(--color-dark-2);
	}
}
</style>
