<script setup lang='ts'>
import type { NuanceColor, NuanceSpacing } from '@nui/types'
import type { MaybeRef } from 'vue'

import { getSpacing } from '@nui/utils'
import { computed, unref } from 'vue'

import type { BoxProps } from './box.vue'
import type { LinkProps } from './link'
import type { TextProps } from './text.vue'

import Box from './box.vue'
import { pickLinkProps } from './link'
import Link from './link/link.vue'
import Text from './text.vue'


export interface BreadcrumbsItem extends Omit<LinkProps, 'mod'> {
	label: string
	icon?: string
	class?: string
	slot?: string
}

export interface BreadcrumbsProps extends BoxProps {
	/** Manual items array */
	items?: MaybeRef<BreadcrumbsItem[]>

	/** Separator icon between items @default `'gravity-ui:chevron-right'` */
	separator?: string

	/** Controls spacing between separator and breadcrumb @default `'xs'` */
	spacing?: NuanceSpacing

	/** Function to determine if an item is active */
	activeItem?: (item: BreadcrumbsItem) => boolean

	color?: NuanceColor
	size?: TextProps['fz']
}

const {
	is = 'ol',
	mod,
	spacing,
	separator = 'gravity-ui:chevron-right',
	color = 'primary',
	size,
	items,
} = defineProps<BreadcrumbsProps>()

const style = computed(() => ({
	'--bc-spacing': getSpacing(spacing),
}))
</script>

<template>
	<Box :is :mod :style	:class='$style.root' aria-label='breadcrumb'>
		<template v-for='(item, ix) in unref(items)' :key='ix'>
			<Text
				is='li'
				:c='color'
				:fz='size'
				:class='$style.breadcrumb'
				role='presentation'
				aria-hidden='true'
			>
				<NuxtLink v-slot='{ isActive }' v-bind='pickLinkProps(item).link' custom>
					<slot
						:name='item.slot ?? "item"'
						:item='item'
						:ix='ix'
						:active='activeItem ? activeItem(item) : isActive'
					>
						<Link
							v-bind='pickLinkProps(item).link'
							inherit
							:class='$style.item'
							:mod='{ active: activeItem ? activeItem(item) : isActive }'
						>
							<Icon v-if='item?.icon' :name='item.icon' :class='$style.icon' />
							<Text is='span' inherit truncate>
								{{ item.label }}
							</Text>
						</Link>
					</slot>
				</NuxtLink>
			</Text>
			<li v-if='ix < unref(items)!.length - 1' role='presentation' aria-hidden='true' :class='$style.separator'>
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

	color: var(--color-text);
	white-space: nowrap;
	-webkit-tap-highlight-color: transparent;

}

.item {
	display: flex;
	gap: .25rem;
	align-items: center;
	text-transform: capitalize;

	font-weight: 600;

	&:where([data-active]) {
		color: var(--text-color);
	}
}

.icon {
	width: 1.2em;
	height: 1.2em;
}

.separator {
	display: flex;
	align-items: center;
	justify-content: center;

	line-height: 1;

	@mixin where-light {
		color: var(--color-gray-7);
	}

	@mixin where-dark {
		color: var(--color-dark-2);
	}
}
</style>
