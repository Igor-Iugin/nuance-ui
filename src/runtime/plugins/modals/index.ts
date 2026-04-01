import { markRaw } from 'vue'

import { ModalManager } from './modal-manager'


export const $modals = markRaw(new ModalManager())
