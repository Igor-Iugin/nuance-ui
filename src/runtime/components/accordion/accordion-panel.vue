<script lang="ts">
export interface AccordionPanelProps {
	/** Overrides the accordion-level `keepMounted`. When unset, inherits from the accordion. */
	keepMounted?: boolean

	/** Overrides the accordion-level `transitionDuration` */
	transitionDuration?: number
}
</script>

<script setup lang='ts'>
import { computed } from 'vue'

import Collapse from '../collapse.vue'
import css from './accordion.module.css'
import { useAccordionItemState, useAccordionRootState } from './lib/context'


const { keepMounted, transitionDuration } = defineProps<AccordionPanelProps>()

const root = useAccordionRootState()
const item = useAccordionItemState()

const open = computed({
	get: () => item.open.value,
	set: v => {
		// Collapse may toggle internally; reflect it back through the accordion
		if (v !== item.open.value)
			root.toggleItem(item.value.value)
	},
})

const panelId = computed(() => root.getPanelId(item.value.value))
const headerId = computed(() => root.getHeaderId(item.value.value))
</script>

<template>
	<Collapse
		v-model:open='open'
		:keep-mounted='keepMounted ?? root.keepMounted.value'
		:transition-duration='transitionDuration ?? root.transitionDuration.value'
		:class='[css.panel, root.classes.value?.panel]'
	>
		<div
			:id='panelId'
			role='region'
			:aria-labelledby='headerId'
			:class='[css.content, root.classes.value?.content]'
		>
			<slot :open='item.open.value' />
		</div>
	</Collapse>
</template>
