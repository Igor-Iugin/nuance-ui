import { defineNuxtPlugin, useAppConfig } from '#imports'

import type { ToastManagerConfig } from '../toast/toast-manager'

import { configureToast } from '../toast/toast-manager'


export default defineNuxtPlugin(() => {
	const cfg = useAppConfig()
	configureToast(cfg.nui.toast as ToastManagerConfig)
})
