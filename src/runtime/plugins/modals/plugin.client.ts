import { defineNuxtPlugin, markRaw } from '#imports'

import { ModalManager } from './modal-manager'


export const $modals = markRaw(new ModalManager())

export default defineNuxtPlugin(() => {
	return {
		provide: {
			modals: $modals,
		},
	}
})
