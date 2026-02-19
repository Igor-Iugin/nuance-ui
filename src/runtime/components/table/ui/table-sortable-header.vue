<script setup lang="ts" generic="TData extends TableData">
import type { ButtonProps } from '../../button/button.vue'
import type { TableData } from '../model'
import type { TableSortIconProps } from './table-sort-icon.vue'

import Button from '../../button/button.vue'
import TableSortIcon from './table-sort-icon.vue'


export interface TableSortableHeaderProps<TData extends TableData>
	extends ButtonProps, TableSortIconProps<TData> {
}

const {
	column,
	icons,
	size = 'compact-sm',
	variant = 'subtle',
	color = 'gray',
	...rest
} = defineProps<TableSortableHeaderProps<TData>>()
</script>

<template>
	<Button :size :variant :color v-bind='rest'>
		<template #leftSection>
			<TableSortIcon :column :icons />
		</template>
		<slot />
		<template v-if='!!$slots.rightSection' #rightSection>
			<slot name='rightSection' />
		</template>
	</Button>
</template>
