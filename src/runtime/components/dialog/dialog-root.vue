<script lang='ts' setup>
import type { UiKitRadius, UiKitShadow, UiKitSize, UiKitSpacing } from '@nui/types'
import type { CSSProperties } from 'vue'

import { getRadius, getShadow, getSize, getSpacing, rem } from '@nui/utils'
import { onClickOutside, unrefElement } from '@vueuse/core'
import { computed, onMounted, shallowRef, watch } from 'vue'

import type { BoxProps } from '../box.vue'
import type { TransitionName } from '../transition'
import type { DialogEmits, DialogModel } from './types'

import NBox from '../box.vue'
import NTransition from '../transition/transition.vue'
import css from './dialog.module.css'
import { useProvideDialogState } from './lib'


export interface DialogRootProps extends Omit<BoxProps, 'is'> {
	/** If set, the dialog is closed when user clicks on the overlay @default `true` */
	closeOnClickOutside?: boolean

	/** If set, the component is rendered inside `Portal` @default `true` */
	withinPortal?: boolean

	/** If set, the component is rendered with `Overlay` @default `true` */
	withoutOverlay?: boolean

	/** Top/bottom modal offset @default `5dvh` */
	yOffset?: CSSProperties['marginTop']

	/** Left/right modal offset @default `5vw` */
	xOffset?: CSSProperties['marginLeft']

	/** Key of `theme.radius` or any valid CSS value to set `border-radius` @default `theme.defaultRadius` */
	radius?: UiKitRadius

	/** Controls width of the content area @default `'md'` */
	size?: UiKitSize

	/** Key of `theme.shadows` or any valid CSS box-shadow value @default `'xl'` */
	shadow?: UiKitShadow

	/** Key of `theme.spacing` or any valid CSS value to set content, header and footer padding @default `'md'` */
	padding?: UiKitSpacing

	/** Passes a class to root element */
	rootClass?: string

	transition?: TransitionName
}

const {
	withinPortal = true,
	closeOnClickOutside = true,
	mod,
	xOffset,
	yOffset,
	radius,
	padding,
	size,
	shadow,
	rootClass,
	transition = 'fade-down',
	withoutOverlay = false,
} = defineProps<DialogRootProps>()

const emit = defineEmits<DialogEmits>()
const opened = defineModel<DialogModel['open']>('open', { default: false })

useProvideDialogState(() => opened.value = false)

function overlayClick(event: MouseEvent) {
	if (event.target === event.currentTarget && closeOnClickOutside && !withoutOverlay)
		opened.value = false
}

function open(dialog: HTMLDialogElement | null | undefined) {
	emit('open')
	dialog?.showModal()
}

const dialogRef = shallowRef<HTMLDialogElement | null>(null)
if (closeOnClickOutside) {
	onClickOutside(dialogRef, () => opened.value = false)
}

// Следим за изменениями v-model и синхронизируем с dialog
watch(opened, isOpen => {
	const dialog = unrefElement(dialogRef)
	if (!dialog)
		return

	if (isOpen)
		open(dialog)
	else
		dialog?.close()
}, { flush: 'post' })

onMounted(() => {
	if (!opened.value)
		return

	open(unrefElement(dialogRef))
})

const style = computed(() => ({
	'--dialog-size': getSize(size, 'dialog-size'),
	'--dialog-radius': radius ? getRadius(radius) : undefined,
	'--dialog-padding': getSpacing(padding),
	'--dialog-y-offset': yOffset ? rem(yOffset) : undefined,
	'--dialog-x-offset': xOffset ? rem(xOffset) : undefined,
	'--dialog-shadow': getShadow(shadow),
}))
</script>

<template>
	<Teleport :disabled='!withinPortal' to='body'>
		<NBox
			is='dialog'
			ref='dialogRef'
			:class='[css.root, rootClass]'
			:mod='[{ "without-overlay": withoutOverlay }, mod]'
			:style
			@click='overlayClick'
			@close='$emit("close")'
			@cancel.prevent='() => closeOnClickOutside && (opened = false)'
		>
			<NTransition :name='transition'>
				<NBox is='section' v-if='opened' :class='css.content' v-bind='$attrs'>
					<slot />
				</NBox>
			</NTransition>
		</NBox>
	</Teleport>
</template>
