import { computed } from 'vue'

import { $notifications } from './notifications-store'


/** Reactive access to the global notifications state. */
export function useNotifications() {
	return {
		/** Currently visible notifications. */
		notifications: computed(() => $notifications.state.notifications),
		/** Queued notifications waiting for a free slot. */
		queue: computed(() => $notifications.state.queue),
	}
}
