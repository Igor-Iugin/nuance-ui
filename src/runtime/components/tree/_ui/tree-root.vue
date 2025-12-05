<script setup lang='ts' generic='T extends string = string'>
import type { NuanceSize } from '@nui/types'

import { useStyleResolver } from '@nui/composals'
import { getSize, removeTreeNodes } from '@nui/utils'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import type { RovingFocusProps } from '../../roving-focus/roving-focus.vue'
import type { TreeIconResolver, TreeModels } from '../model'

import Box from '../../box.vue'
import RovingFocus from '../../roving-focus/roving-focus.vue'
import { useProvideTreeState } from '../lib/context'


export type TreeRootProps<T extends string = string> = RovingFocusProps & {
	size?: NuanceSize | string
	iconResolver?: TreeIconResolver<T>
	removable?: boolean
}

const {
	size,
	attr,
	loop,
	orientation,
	iconResolver = () => ({ icon: 'gravity-ui:file' }),
	removable = false,
} = defineProps<TreeRootProps<T>>()

const tree = defineModel<TreeModels<T>['tree']>('tree', { required: true })
const active = defineModel<TreeModels<T>['active']>('active', { default: null })
const selected = defineModel<TreeModels<T>['selected']>('selected', { default: [] })
const expanded = defineModel<TreeModels<T>['expanded']>('expanded', { default: [] })

const style = useStyleResolver(() => ({
	'--icon-size': getSize(size),
}))

const root = useTemplateRef<HTMLUListElement>('parent')
onClickOutside(root, () => selected.value = [])

useProvideTreeState<T>({
	tree,
	active,
	selected,
	expanded,
	iconResolver,
})

if (removable) {
	useEventListener(root, 'keydown', event => {
		if (event.key === 'Delete') {
			event.preventDefault()
			return tree.value = removeTreeNodes(tree.value, selected.value)
		}
	})
}
</script>

<template>
	<RovingFocus :attr :loop :orientation>
		<Box
			is='ul'
			ref='parent'
			role='tree'
			:style
			:class='$style.root'
			@keydown.esc.prevent='selected.value = []'
		>
			<slot />
		</Box>
	</RovingFocus>
</template>

<style module lang='postcss'>
.root {
	--tree-icon-size: var(--spacing-md);

	display: flex;
	flex-direction: column;
	gap: .25rem;

	padding-inline-start: 0;

	list-style: none;
}
</style>
