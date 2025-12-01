<script lang='ts' setup>
import { computed } from 'vue'

import type { DialogEmits, DialogModel, DialogRootProps } from '../dialog'

import DialogRoot from '../dialog/dialog-root.vue'
import css from './drawer.module.css'


type OmittedDialogRootProps = Omit<DialogRootProps, 'modal' | 'closeOnClickOutside' | 'rootClass' | 'transition'>

export interface DrawerRootProps extends OmittedDialogRootProps {
	/** Side of the screen on which drawer will be opened @default `'left'` */
	position?: 'bottom' | 'left' | 'right' | 'top'
}

const {
	position = 'left',
	withoutOverlay = true,
	mod,
	withinPortal = true,
	...rest
} = defineProps<DrawerRootProps>()

defineEmits<DialogEmits>()
const opened = defineModel<DialogModel['open']>('open', { default: false })

const transition = computed(() => {
	switch (position) {
		case 'right':
			return 'fade-left'
		case 'top':
			return 'fade-down'
		case 'bottom':
			return 'fade-up'
		default:
			return 'fade-right'
	}
})
</script>

<template>
	<DialogRoot
		v-model:open='opened'
		:mod='[{ position }, mod]'
		:root-class='css.root'
		:class='css.content'
		:within-portal
		:without-overlay
		:transition
		v-bind='rest'
		@open='$emit("open")'
		@close='$emit("close")'
	>
		<slot />
	</DialogRoot>
</template>
