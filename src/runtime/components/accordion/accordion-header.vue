<script lang="ts">
export interface AccordionHeaderProps {
	/** Leading icon name shown before the label */
	icon?: string

	/** Overrides the accordion-level chevron icon for this item */
	chevron?: string
}

export interface AccordionHeaderSlots {
	/** Header label */
	default?: (props: { open: boolean }) => any
	/** Leading content, replaces the `icon` prop */
	icon?: (props: { open: boolean }) => any
	/** Trailing content, replaces the chevron */
	chevron?: (props: { open: boolean }) => any
}
</script>

<script setup lang='ts'>
import { useConfig } from '@nui/composables'
import { computed } from 'vue'

import Box from '../box.vue'
import Title from '../title.vue'
import css from './accordion.module.css'
import { useAccordionItemState, useAccordionRootState } from './lib/context'


const { icon, chevron } = defineProps<AccordionHeaderProps>()

defineSlots<AccordionHeaderSlots>()

const { icons } = useConfig()
const root = useAccordionRootState()
const item = useAccordionItemState()

const headerId = computed(() => root.getHeaderId(item.value.value))
const panelId = computed(() => root.getPanelId(item.value.value))

const chevronIcon = computed(() => chevron ?? root.chevron.value ?? icons.chevronDown)
const rotate = computed(() => item.open.value && !root.disableChevronRotation.value)

function onClick() {
	if (item.disabled.value)
		return
	root.toggleItem(item.value.value)
}
</script>

<template>
	<component
		:is='root.order.value ? Title : "div"'
		v-bind='root.order.value ? { order: root.order.value, is: `h${root.order.value}` } : {}'
		:class='[css.header, root.classes.value?.header]'
	>
		<Box
			is='button'
			:id='headerId'
			type='button'
			:disabled='item.disabled.value'
			:aria-expanded='item.open.value'
			:aria-controls='panelId'
			:mod='{
				"state": item.dataState.value,
				"disabled": item.dataDisabled.value,
				"chevron-position": root.chevronPosition.value,
			}'
			:class='[css.control, css[`control--${root.variant.value}`], root.classes.value?.control]'
			@click='onClick'
		>
			<Box
				is='span'
				v-if='$slots.icon || icon'
				:mod='{ "chevron-position": root.chevronPosition.value }'
				:class='[css.icon, root.classes.value?.icon]'
			>
				<slot name='icon' :open='item.open.value'>
					<Icon v-if='icon' :name='icon' />
				</slot>
			</Box>

			<span :class='[css.label, root.classes.value?.label]'>
				<slot :open='item.open.value' />
			</span>

			<Box
				is='span'
				:mod='{ rotate: rotate || undefined, position: root.chevronPosition.value }'
				:class='[css.chevron, root.classes.value?.chevron]'
			>
				<slot name='chevron' :open='item.open.value'>
					<Icon :name='chevronIcon' />
				</slot>
			</Box>
		</Box>
	</component>
</template>
