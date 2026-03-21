import { $modals } from '@nui/composals'

import type { ConfirmModalProps } from './confirm-modal.vue'

import ConfirmModal from './confirm-modal.vue'


export type { ConfirmModalProps }

/**
 * Opens the confirm modal from any context.
 *
 * Resolves with `true` if the user confirmed, rejects if cancelled.
 */
export const openConfirmModal = $modals.create<ConfirmModalProps, boolean>(
	'confirm',
	ConfirmModal,
)
