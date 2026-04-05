<script lang='ts' setup>
import type { NuanceRadius, NuanceShadow, NuanceSize, NuanceSpacing } from '@nui/types'
import type { CSSProperties, RendererElement } from 'vue'

import { getRadius, getShadow, getSize, getSpacing, rem } from '@nui/utils'
import { onClickOutside, unrefElement } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'

import type { BoxProps } from '../../box.vue'
import type { TransitionName } from '../../transition.vue'
import type { DialogEmits, DialogModel } from '../types'

import Box from '../../box.vue'
import NTransition from '../../transition.vue'
import { useProvideDialogState } from '../lib'
import css from './dialog.module.css'


export interface DialogRootProps extends BoxProps {
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
	radius?: NuanceRadius

	/** Controls width of the content area @default `'md'` */
	size?: NuanceSize

	/** Key of `theme.shadows` or any valid CSS box-shadow value @default `'xl'` */
	shadow?: NuanceShadow

	/** Key of `theme.spacing` or any valid CSS value to set content, header and footer padding @default `'md'` */
	padding?: NuanceSpacing

	/** Passes a class to root element */
	rootClass?: string

	transition?: TransitionName

	/** Portal target to render element @default 'body' */
	portalTarget?: string | RendererElement | null
}

defineOptions({ inheritAttrs: false })

const {
	withinPortal = false,
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
	portalTarget = 'body',
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
	if (withoutOverlay)
		dialog?.show()
	else
		dialog?.showModal()
}

const dialogRef = shallowRef<HTMLDialogElement | null>(null)
if (closeOnClickOutside) {
	onClickOutside(dialogRef, () => opened.value = false)
}

// Синхронизируем состояние v-model с нативным <dialog>.
// Следим за обоими значениями: opened может стать true до появления элемента в DOM
// (ClientOnly + Teleport), а элемент может появиться когда opened уже true.
watch([opened, () => unrefElement(dialogRef)] as const, ([isOpen, dialog]) => {
	if (!dialog)
		return

	if (isOpen)
		open(dialog)
	else
		dialog.close()
}, { flush: 'post' })

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
	<ClientOnly>
		<Teleport :disabled='!withinPortal' :to='portalTarget'>
			<Box
				is='dialog'
				ref='dialogRef'
				:class='[css.root, rootClass]'
				:mod='[{ "without-overlay": withoutOverlay }, mod]'
				:style
				@click='overlayClick'
				@close='$emit("close")'
				@cancel.prevent='opened = false'
			>
				<NTransition :name='transition'>
					<Box is='section' v-if='opened' :class='css.content' v-bind='$attrs'>
						<slot />
					</Box>
				</NTransition>
			</Box>
		</Teleport>
	</ClientOnly>
</template>
