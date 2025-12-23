<script setup lang='ts'>
import { useTheme } from '@nui/composals'
import { getThemeColor } from '@nui/utils'
import { computed, watch } from 'vue'

import type { TreeItem } from '../model'

import ActionIcon from '../../action-icon/action-icon.vue'
import Button from '../../button/button.vue'
import Loader from '../../loader/loader.vue'
import RovingFocusItem from '../../roving-focus/roving-focus-item.vue'
import UTransition from '../../transition/transition.vue'
import { useTreeState } from '../lib/context'
import { filterTreeItems } from '../lib/filter-tree-items'
import { useTreeItemHandlers } from '../lib/item-handlers'


export interface TreeItemProps extends TreeItem {
	level: number
}

const {
	type = 'file',
	icon = 'gravity-ui:folder',
	trailingIcon = 'gravity-ui:folder-open',
	path,
	name,
	level,
	disabled,
} = defineProps<TreeItemProps>()

const { value: theme } = useTheme()

const isFolder = computed(() => type === 'directory')

const ctx = useTreeState()
const selected = computed(() => ctx.selected.value.includes(path))
const expanded = computed(() => ctx.expanded.value.includes(path))
const active = computed(() => ctx.active.value === path)

const { data: state, pending, execute } = ctx.loadBranch(path)
const data = computed(() => filterTreeItems(state.value, ctx.filter))
// Execute only if opened
watch(expanded, expanded => {
	if (expanded) {
		try {
			execute()
		}
		catch (e) {
			console.error(e)
			ctx.off('expand', path)
		}
	}
}, { immediate: true })

const { icon: fileIcon, color } = ctx.iconResolver(type, name, path, disabled)
const { handleClick, handleKeyDown } = useTreeItemHandlers(path, isFolder, expanded)
</script>

<template>
	<li :class='$style.item' role='presentation'>
		<RovingFocusItem>
			<Button
				:size='ctx.size'
				:color='ctx.color'
				:variant='ctx.variant'
				:disabled
				role='treeitem'
				:classes='$style'
				:aria-level='level'
				:aria-selected='selected'
				:mod='{ active, selected, "tree-item": path }'
				right-section-p-e='all'
				@click.prevent='handleClick'
				@keydown.prevent='handleKeyDown'
			>
				<template #leftSection>
					<template v-if='pending'>
						<Loader :class='$style.icon' />
					</template>

					<template v-else-if='isFolder'>
						<Icon v-if='expanded' :class='$style.icon' :name='trailingIcon' />
						<Icon v-else :class='$style.icon' :name='icon' />
					</template>

					<template v-else>
						<Icon
							:class='$style.icon'
							:name='fileIcon'
							:style='{ color: color && getThemeColor(color, theme) }'
						/>
					</template>
				</template>

				{{ name ?? path }}

				<template v-if='isFolder' #rightSection>
					<ActionIcon
						icon='gravity-ui:chevron-down'
						size='sm'
						:color='ctx.color'
						:classes='{ root: $style.chevron, icon: $style["chevron-icon"] }'
						:mod='{ expanded }'
						variant='subtle'
						@click.stop='ctx.toggle("expand", path)'
					/>
				</template>
			</Button>
		</RovingFocusItem>

		<UTransition name='scale-y'>
			<ul
				v-if='expanded && data && data.length > 0'
				:class='$style.list'
				role='group'
			>
				<TreeItem
					v-for='child in data'
					:key='child.path'
					v-bind='child'
					:path='child.path'
					:level='level + 1'
				/>
			</ul>
		</UTransition>
	</li>
</template>

<style module lang='postcss'>
.item {
	display: grid;
	gap: .25rem;
}

.icon {
	--loader-size: var(--tree-icon-size);

	width: var(--tree-icon-size);
	height: var(--tree-icon-size);
}

.chevron {
	color: var(--color-dimmed);

	transition: transform .3s ease-in-out;

	&:hover {
		color: var(--color-dimmed);

		background-color: transparent;
	}

	&[data-expanded] .chevron-icon {
		transform: rotate(-180deg);
	}
}


.list {
	display: grid;
	gap: .25rem;

	margin-inline-start: 1rem;

	padding-inline-start: .75rem;
	border-left: 1px solid var(--color-gray-4);
}

.root {
	.inner {
		display: grid;
		grid-template-columns: auto 1fr auto;

		color: var(--color-text);

		.label {
			font-weight: 500;
		}
	}

	&[data-active],
	&[data-selected] {
		.inner {
			color: var(--button-color);
		}
	}

	&[data-selected] {
		background: alpha(var(--button-color), .1);
	}
}
</style>
