<script setup lang='ts'>
import type { ButtonProps, ButtonVariant } from '@nui/components'
import type { NuanceColor } from '@nui/types'

import { useStyleResolver } from '@nui/composables'
import { getSize } from '@nui/utils'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { useTemplateRef } from 'vue'

import type { RovingFocusProps } from '../../roving-focus/roving-focus.vue'
import type { TreeEmits, TreeFilter, TreeIconResolver, TreeLoader, TreeModels } from '../types'

import Box from '../../box.vue'
import RovingFocus from '../../roving-focus/roving-focus.vue'
import { useProvideTreeState } from '../lib/context'


export type TreeRootProps = RovingFocusProps & {
	/** Resolves the icon for a given tree item */
	iconResolver?: TreeIconResolver

	/** If set, selected items can be deleted with the Delete key */
	removable?: boolean

	/** If set, multiple items can be selected */
	selectable?: boolean

	/** Async loader for branch data */
	loadBranch: TreeLoader

	/** Filters which items are rendered */
	filter?: TreeFilter

	/** Visual variant */
	variant?: ButtonVariant

	/** Color from theme */
	color?: NuanceColor

	/** Component size */
	size?: ButtonProps['size']
}

const {
	color,
	attr,
	loop,
	orientation,
	variant = 'subtle',
	size = 'compact-sm',
	iconResolver = () => ({ icon: 'gravity-ui:file' }),
	removable = false,
	selectable = false,
	loadBranch,
	filter,
} = defineProps<TreeRootProps>()

const emit = defineEmits<TreeEmits>()

const active = defineModel<TreeModels['active']>('active', { default: null })
const selected = defineModel<TreeModels['selected']>('selected', { default: [] })
const expanded = defineModel<TreeModels['expanded']>('expanded', { default: [] })

const style = useStyleResolver(() => ({
	'--icon-size': getSize(size),
}))

const root = useTemplateRef<HTMLUListElement>('parent')
onClickOutside(root, () => selected.value = [])

useProvideTreeState({
	root,
	active,
	selected,
	expanded,
	iconResolver,
	size,
	color,
	variant,
	selectable,
	loadBranch,
	filter,
})

if (removable) {
	useEventListener(root, 'keydown', event => {
		if (event.key === 'Delete') {
			event.preventDefault()
			emit('delete', selected.value)
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
			@keydown.esc.prevent='selected = []'
		>
			<slot />
		</Box>
	</RovingFocus>
</template>

<style module>
.root {
	--tree-icon-size: var(--spacing-md);

	display: flex;
	flex-direction: column;
	gap: .25rem;

	padding-inline-start: 0;
}
</style>
