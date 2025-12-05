<script setup lang='ts' generic='T extends string = string'>
import { useTheme } from '@nui/composals'
import { getThemeColor, isFalsy } from '@nui/utils'
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
	disabled,
} = item

const { value: theme } = useTheme()

const isFolder = computed(() => !isFalsy(children))

const ctx = useTreeState<T>()
const selected = computed(() => ctx.selected.value.includes(value))
const expanded = computed(() => ctx.expanded.value.includes(value))
const active = computed(() => ctx.active.value === value)

const { icon: fileIcon, color } = ctx.iconResolver(item)

const { focus } = useRovingFocus()

function handleClick(event: MouseEvent) {
	if (event.shiftKey)
		ctx.toggle('select', value, 'range') // Shift + Click - выбор диапазона
	else if (event.ctrlKey || event.metaKey)
		ctx.toggle('select', value, 'multiple') // Ctrl/Cmd + Click - множественный выбор
	else
		ctx.toggle('select', value, 'single') // Обычный клик - одиночный выбор

	// Раскрываем/закрываем папку только при обычном клике
	if (isFolder.value && !event.ctrlKey && !event.metaKey && !event.shiftKey)
		ctx.toggle('expand', value)
}

function handleKeyDown(event: KeyboardEvent) {
	switch (event.key) {
		// Arrow Left - закрыть папку или перейти к родителю
		case 'ArrowLeft': {
			event.preventDefault()
			if (isFolder.value && expanded.value)
				return ctx.off('expand', value)
			else
				return focus('prev', event.currentTarget as HTMLElement)
		}
		// Arrow Right - открыть папку или перейти к первому ребенку
		case 'ArrowRight': {
			event.preventDefault()
			if (isFolder.value && !expanded.value)
				return ctx.on('expand', value)
			else if (expanded.value)
				return focus('next', event.currentTarget as HTMLElement)
			break
		}
		// Enter/Space - выбор элемента
		case 'Enter':
			ctx.on('select', value)
			return ctx.setActive(value)
		case ' ': {
			event.preventDefault()
			if (event.shiftKey)
				return ctx.toggle('select', value, 'range')
			else if (event.ctrlKey || event.metaKey)
				return ctx.toggle('select', value, 'multiple')

			return ctx.toggle('select', value, 'single')
		}
	}
}
</script>

<template>
	<li :class='$style.root' role='presentation'>
		<RovingFocusItem>
			<Button
				variant='subtle'
				size='compact-md'
				role='treeitem'
				:classes='{
					root: $style.button,
					label: $style.label,
					inner: $style.inner,
					section: $style.section,
				}'
				:mod='{ active, selected, level }'
				:aria-selected='selected'
				:aria-level='level'
				:disabled
				@click.prevent='handleClick'
				@keydown.prevent='handleKeyDown'
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
	.inner {
		display: grid;
		grid-template-columns: auto 1fr auto;

		color: var(--color-text);

		.label {
			font-size: var(--font-size-sm);
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
