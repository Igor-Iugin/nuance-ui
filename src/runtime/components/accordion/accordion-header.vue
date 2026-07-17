<script lang="ts">
import type { BoxProps } from '../box/box.vue'


export interface AccordionHeaderProps extends BoxProps {
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

import Box from '../box/box.vue'
import UnstyledButton from '../button/unstyled-button.vue'
import Title from '../title.vue'
import css from './accordion.module.css'
import { useAccordionItemState, useAccordionRootState } from './lib/context'


const { is, icon, chevron, ...rest } = defineProps<AccordionHeaderProps>()

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
	<Box
		:is='root.order.value ? Title : is'
		v-bind='root.order.value
			? { order: root.order.value, ...rest }
			: rest'
		:class='[css.header, root.classes.value?.header]'
	>
		<UnstyledButton
			:id='headerId'
			type='button'
			:disabled='item.disabled.value'
			:aria-expanded='item.open.value'
			:aria-controls='panelId'
			:mod='{
				"state": item.dataState.value,
				"variant": root.variant.value,
				"disabled": item.disabled.value,
				"chevron-position": root.chevronPosition.value,
			}'
			:class='[css.control, root.classes.value?.control]'
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
				:mod='{ rotate, position: root.chevronPosition.value }'
				:class='[css.chevron, root.classes.value?.chevron]'
			>
				<slot name='chevron' :open='item.open.value'>
					<Icon :name='chevronIcon' />
				</slot>
			</Box>
		</UnstyledButton>
	</Box>
</template>
