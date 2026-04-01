import type { ConfirmModalProps } from './confirm-modal.vue'

import { $modals } from '../modal-manager'
import ConfirmModal from './confirm-modal.vue'


/**
 * Opens the confirm modal from any context.
 *
 * Resolves with `true` if the user confirmed, rejects if cancelled.
 */
export const openConfirmModal = $modals.create<ConfirmModalProps, boolean>(
	'confirm',
	ConfirmModal,
)

export type { ConfirmModalProps }
