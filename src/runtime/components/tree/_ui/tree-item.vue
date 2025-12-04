<script setup lang='ts' generic='T extends string = string'>
import { useTheme } from '@nui/composals'
import { getThemeColor } from '@nui/utils'
import { computed } from 'vue'

import type { TreeItem } from '../model'

import Button from '../../button/button.vue'
import { useRovingFocus } from '../../roving-focus'
import RovingFocusItem from '../../roving-focus/roving-focus-item.vue'
import { useTreeState } from '../lib/context'


interface TreeItemProps<T extends string = string> {
	item: TreeItem<T>
	level: number
}

const { item, level } = defineProps<TreeItemProps<T>>()
const {
	icon = 'gravity-ui:folder',
	trailingIcon = 'gravity-ui:folder-open',
	value,
	label,
	children,
} = item

const { value: theme } = useTheme()

const isFolder = computed(() => children && children.length > 0)

const ctx = useTreeState()
const selected = computed(() => ctx.selected.value.includes(value))
const expanded = computed(() => ctx.expanded.value.includes(value))

const { icon: fileIcon, color } = ctx.iconResolver(item)

const { focus } = useRovingFocus()
</script>

<template>
	<li :class='$style.root' role='presentation'>
		<RovingFocusItem>
			<Button
				color='gray'
				variant='subtle'
				:mod='{ selected, level }'
				size='compact-md'
				:classes='{
					label: $style.label,
					inner: $style.button,
					section: $style.section,
				}'
				role='treeitem'
				:aria-selected='selected'
				:aria-level='level'
				@click.prevent='ctx.toggle("expand", item.value)'
				@keydown.left.prevent='!expanded ? focus("prev", $event.currentTarget) : ctx.off("expand", item.value)'
				@keydown.right.prevent='expanded ? focus("next", $event.currentTarget) : ctx.on("expand", item.value)'
			>
				<template v-if='isFolder' #leftSection>
					<Icon v-if='expanded' :class='$style.icon' :name='trailingIcon' />
					<Icon v-else :class='$style.icon' :name='icon' />
				</template>
				<template v-else #leftSection>
					<Icon
						:class='$style.icon'
						:name='fileIcon'
						:style='{ color: color && getThemeColor(color, theme) }'
					/>
				</template>
				{{ label ?? value }}
			</Button>
		</RovingFocusItem>

		<ul
			v-if='expanded && item.children && item.children.length > 0'
			:class='$style.list'
			role='group'
		>
			<TreeItem
				v-for='child in item.children'
				:key='child.value'
				:item='child'
				:level='level + 1'
			/>
		</ul>
	</li>
</template>

<style module lang='postcss'>
.root {
	display: grid;
	gap: .25rem;
}

.button {
	display: grid;
	grid-template-columns: auto 1fr auto;
}

.label {
	font-size: var(--font-size-sm);
	font-weight: 500;
	color: var(--color-text);
}

.section {
	color: var(--color-text);
}

.icon {
	width: var(--tree-icon-size);
	height: var(--tree-icon-size);
}

.list {
	display: grid;
	gap: .25rem;

	margin-inline-start: 1rem;

	padding-inline-start: .75rem;
	border-left: 1px solid var(--color-gray-4);

	list-style: none;
}
</style>
