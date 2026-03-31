import { defineNuxtPlugin } from '#imports'

import { ModalManager } from './modal-manager'


export const $modals = new ModalManager()

export default defineNuxtPlugin(() => {
	return {
		provide: {
			modals: $modals,
		},
	}
})
