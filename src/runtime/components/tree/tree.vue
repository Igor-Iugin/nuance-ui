<script setup lang='ts'>
import { onMounted } from 'vue'

import type { TreeRootProps } from './_ui/tree-root.vue'
import type { TreeEmits, TreeModels } from './model'

import UTreeItem from './_ui/tree-item.vue'
import TreeRoot from './_ui/tree-root.vue'


export interface TreeProps extends TreeRootProps {
}

const {
	color,
	variant = 'subtle',
	size = 'compact-sm',
	loadBranch,
	...props
} = defineProps<TreeProps>()
defineEmits<TreeEmits>()

const active = defineModel<TreeModels['active']>('active', { default: null })
const selected = defineModel<TreeModels['selected']>('selected', { default: [] })
const expanded = defineModel<TreeModels['expanded']>('expanded', { default: [] })

const { data: root, execute } = loadBranch('/')
onMounted(execute)
</script>

<template>
	<TreeRoot
		v-bind='props'
		v-model:active='active'
		v-model:selected='selected'
		v-model:expanded='expanded'
		:load-branch
		:size
		:color
		:variant
		@delete='path => $emit("delete", path)'
	>
		<UTreeItem
			v-for='item in root'
			:key='item.path'
			v-bind='item'
			:path='item.path'
			:level='1'
		/>
	</TreeRoot>
</template>
