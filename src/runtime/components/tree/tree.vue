<script setup lang='ts' generic='T extends string = string'>
import { computed } from 'vue'

import type { TreeRootProps } from './_ui/tree-root.vue'
import type { TreeItem, TreeModels } from './model'

import UTreeItem from './_ui/tree-item.vue'
import TreeRoot from './_ui/tree-root.vue'
import { getExpandedItems } from './lib/get-default'


export interface TreeProps<T extends string = string> extends TreeRootProps {
	data: TreeItem<T>[]
}

const props = defineProps<TreeProps<T>>()
const items = computed(() => props.data)

const selected = defineModel<TreeModels<T>['selected']>('selected', {
	default: [],
})
const expanded = defineModel<TreeModels<T>['expanded']>('expanded', {
	default: [],
})

expanded.value = getExpandedItems<T>(props.data)
</script>

<template>
	<TreeRoot v-bind='props' v-model:selected='selected' v-model:expanded='expanded'>
		<UTreeItem
			v-for='item in items'
			:key='item.value'
			:item
			:level='1'
		/>
	</TreeRoot>
</template>
