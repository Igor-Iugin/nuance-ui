<script lang='ts' setup>
import type { DialogEmits, DialogModel, DialogRootProps } from '../dialog'

import DialogRoot from '../dialog/ui/dialog-root.vue'
import css from './modal.module.css'


export interface ModalRootProps extends DialogRootProps {
	/** If set, the modal is centered vertically @default `false` */
	centered?: boolean

	/** If set, the modal takes the entire screen @default `false` */
	fullScreen?: boolean
}

const {
	centered,
	fullScreen,
	mod,
	withoutOverlay = false,
	withinPortal = false,
	closeOnClickOutside = true,
	classes,
	...rest
} = defineProps<ModalRootProps>()
defineEmits<DialogEmits>()

const opened = defineModel<DialogModel['open']>('open', { default: false })
</script>

<template>
	<DialogRoot
		v-model:open='opened'
		:mod='[{ centered, "full-screen": fullScreen }, mod]'
		:within-portal
		:close-on-click-outside
		:without-overlay
		v-bind='rest'
		:classes='{ ...classes, root: [css.root, classes?.root] }'
		@open='$emit("open")'
		@close='$emit("close")'
	>
		<slot />
	</DialogRoot>
</template>
