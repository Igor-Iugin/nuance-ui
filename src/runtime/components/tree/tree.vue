<script setup lang='ts' generic='T extends string = string'>
import { unref } from 'vue'

import type { TreeRootProps } from './_ui/tree-root.vue'
import type { TreeModels } from './model'

import UTreeItem from './_ui/tree-item.vue'
import TreeRoot from './_ui/tree-root.vue'
import { getExpandedItems } from './lib/get-default'


export interface TreeProps<T extends string = string> extends TreeRootProps<T> {
}

const props = defineProps<TreeProps<T>>()

const tree = defineModel<TreeModels<T>['tree']>('tree', { required: true })
const active = defineModel<TreeModels<T>['active']>('active', { default: null })
const selected = defineModel<TreeModels<T>['selected']>('selected', { default: [] })
const expanded = defineModel<TreeModels<T>['expanded']>('expanded', { default: [] })

expanded.value = getExpandedItems<T>(tree.value)
</script>

<template>
	<TreeRoot
		v-bind='props'
		v-model:tree='tree'
		v-model:active='active'
		v-model:selected='selected'
		v-model:expanded='expanded'
	>
		<UTreeItem
			v-for='item in unref(tree)'
			:key='item.value'
			:item
			:level='1'
		/>
	</TreeRoot>
</template>
