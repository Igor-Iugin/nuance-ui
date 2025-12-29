<script setup lang='ts'>
import type { NuanceSpacing } from '@nui/types'
import type { MaybeRef } from 'vue'

import { useTheme } from '@nui/composals'
import { getSpacing } from '@nui/utils'
import { computed, unref } from 'vue'

import type { BoxProps } from './box.vue'
import type { ButtonProps } from './button/button.vue'
import type { LinkProps } from './link'

import Box from './box.vue'
import Button from './button/button.vue'


export interface BreadcrumbsItem extends Omit<LinkProps, 'mod'> {
	active?: boolean
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

	variant?: ButtonProps['variant']
	color?: ButtonProps['color']
	size?: ButtonProps['size']
}

const {
	is = 'ol',
	mod,
	spacing,
	separator = 'gravity-ui:chevron-right',
	color = 'primary',
	variant = 'subtle',
	size = 'compact-sm',
	items,
} = defineProps<BreadcrumbsProps>()

defineEmits<{
	click: [item: BreadcrumbsItem]
}>()

const style = computed(() => ({
	'--bc-spacing': getSpacing(spacing),
}))

const theme = useTheme()
const inactive = computed(() => theme.value === 'dark' ? 'gray' : 'dark')

const breadcrumbs = computed(() => unref(items) ?? [])
</script>

<template>
	<Box :is :mod :style	:class='$style.root' aria-label='breadcrumb'>
		<template v-for='(item, ix) in breadcrumbs' :key='item.to'>
			<li :class='$style.breadcrumb' role='presentation' aria-hidden='true'>
				<slot
					:name='item.slot ?? "item"'
					:item='item'
					:ix='ix'
					:active='item.active ?? (ix === breadcrumbs!.length - 1)'
				>
					<Button
						:size
						:variant
						:class='$style.item'
						:mod='{ active: item.active ?? (ix === breadcrumbs!.length - 1) }'
						:color='item.active ?? (ix === breadcrumbs!.length - 1) ? color : inactive'
						@click.stop.prevent='$emit("click", item)'
					>
						<template v-if='item?.icon' #leftSection>
							<Icon :name='item.icon' :class='$style.icon' />
						</template>
						{{ item.label }}
					</Button>
				</slot>
			</li>
			<li v-if='ix < breadcrumbs.length - 1' role='presentation' aria-hidden='true' :class='$style.separator'>
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
