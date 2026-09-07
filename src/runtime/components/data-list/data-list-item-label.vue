<script lang="ts" setup>
import type { Component } from 'vue'

import { resolveComponent } from 'vue'

import type { AnyString } from '../../types/index.ts'
import type { NuanceColor } from '../../types/theme.ts'
import type { BoxProps } from '../box/box.vue'

import Box from '../box/box.vue'
import css from './data-list.module.css'
import { useDataListState } from './data-list.vue'


export interface DataListItemLabelProps extends Omit<BoxProps, 'is'> {
	/** Icon displayed before label */
	icon?: string

	color?: NuanceColor | AnyString
}

const { icon, color, ...props } = defineProps<DataListItemLabelProps>()

const Icon = resolveComponent('Icon') as Component

const st = useDataListState()
</script>

<template>
	<Box v-bind='props' is='dt' :class='[css.label, st.classes?.label]'>
		<Box :is='Icon' v-if='icon' :name='icon' :c='color' />
		<slot />
	</Box>
</template>
