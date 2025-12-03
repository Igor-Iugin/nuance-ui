<script setup lang='ts'>
import type { NuanceSize } from '@nui/types'

import { useStyleResolver } from '@nui/composals'
import { getSize } from '@nui/utils'

import type { TreeContext } from '../lib/context'
import type { TreeModels } from '../model'

import Box from '../../box.vue'
import { useProvideTreeState } from '../lib/context'


type OmittedContext = Partial<Omit<TreeContext, 'selected' | 'expanded'>>

export interface TreeRootProps extends OmittedContext {
	size?: NuanceSize | string
}

const {
	multiple,
	size,
	iconResolver = () => ({ icon: 'gravity-ui:file' }),
} = defineProps<TreeRootProps>()

const selected = defineModel<TreeModels['selected']>('selected', { default: [] })
const expanded = defineModel<TreeModels['expanded']>('expanded', { default: [] })

useProvideTreeState({
	selected,
	expanded,
	multiple,
	iconResolver,
})

const style = useStyleResolver(() => ({
	'--icon-size': getSize(size),
}))
</script>

<template>
	<Box is='ul' :class='$style.root' :style role='tree' :aria-multiselectable='multiple'>
		<slot />
	</Box>
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
