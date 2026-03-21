<script setup lang="ts">
import type { MaybePromise } from '@nui/types'

import { useModal } from '@nui/composals'
import { ref } from 'vue'

import type { ButtonProps } from '../../button/button.vue'
import type { ModalRootProps } from '../../modal/modal-root.vue'

import Button from '../../button/button.vue'
import ModalCloseButton from '../../modal/modal-close-button.vue'
import ModalHeader from '../../modal/modal-header.vue'
import ModalRoot from '../../modal/modal-root.vue'
import Title from '../../title.vue'


type ConfirmLabels = Record<'confirm' | 'cancel', string>

export interface ConfirmModalProps extends ModalRootProps {
	/** Modal title */
	title: string
	/** Description text displayed below the title */
	description?: string
	/**
	 * Custom button labels.
	 * @default { confirm: 'Confirm', cancel: 'Cancel' }
	 */
	labels?: ConfirmLabels
	/** Display variant. When `'danger'`, the confirm button turns red */
	variant?: 'default' | 'danger'

	/** Callback invoked on cancel */
	onCancel?: () => void
	/** Callback invoked on confirm */
	onConfirm?: () => MaybePromise<void>

	/** Additional props for the cancel button */
	cancelProps?: Partial<ButtonProps>
	/** Additional props for the confirm button */
	confirmProps?: Partial<ButtonProps>
}

const {
	title,
	description: body,
	labels,
	variant = 'default',
	cancelProps,
	confirmProps,
	onConfirm,
	onCancel,
	...rest
} = defineProps<ConfirmModalProps>()

const { opened, resolve: hide } = useModal('confirm')
const loading = ref(false)

function handleCancel() {
	hide(false)
	onCancel?.()
}

async function hanleConfirm() {
	try {
		loading.value = true
		await onConfirm?.()
	}
	finally {
		loading.value = false
		hide(true)
	}
}
</script>

<template>
	<ModalRoot v-model:open='opened' v-bind='rest' size='sm'>
		<ModalHeader>
			<Title order='4'>
				{{ title }}
			</Title>
			<ModalCloseButton />
		</ModalHeader>

		<p v-if='body' :class='$style.body'>
			{{ body }}
		</p>

		<footer :class='$style.footer'>
			<Button
				variant='default'
				v-bind='cancelProps'
				@click='handleCancel()'
			>
				{{ labels?.cancel ?? 'Cancel' }}
			</Button>
			<Button
				variant='filled'
				v-bind='confirmProps'
				:color="variant === 'danger' ? 'red' : undefined"
				:loading
				@click='hanleConfirm()'
			>
				{{ labels?.confirm ?? 'Confirm' }}
			</Button>
		</footer>
	</ModalRoot>
</template>

<style lang="css" module>
.body {
	margin: 0;

	color: var(--color-dimmed);
}

.footer {
	display: flex;
	gap: var(--spacing-sm);
	justify-content: flex-end;

	margin-top: var(--spacing-md);
}
</style>
