<script lang="ts" setup>
import type { Classes } from '@nui/types'

import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'

import { useVarsResolver } from '#imports'

import type { NotificationData, NotificationPosition } from './types'

import NotificationContainer from './notification-container.vue'
import { $notifications } from './notifications-store'
import { useNotifications } from './use-notifications'


interface ProviderVars {
	root:
		| '--notifications-z-index'
		| '--notifications-width'
		| '--transition-duration'
}

export interface NotificationProviderProps {
	/** Default notification position @default 'bottom-right' */
	position?: NotificationPosition
	/** Auto-close in ms, or `false` to disable @default 4000 */
	autoClose?: number | false
	/** Max visible at once @default 5 */
	limit?: number
	/** Viewport z-index @default 1 */
	zIndex?: number | string
	/** Container width @default 440 */
	containerWidth?: number | string
	/** Transition duration in ms @default 250 */
	transitionDuration?: number
	/** Which notifications pause auto-close on hover @default 'all' */
	pauseOnHover?: 'all' | 'notification'
	classes?: Classes<'root' | 'notification'>
}

const {
	position = 'bottom-right',
	autoClose = 4000,
	limit = 5,
	zIndex = 1,
	containerWidth = 440,
	transitionDuration = 250,
	pauseOnHover = 'all',
} = defineProps<NotificationProviderProps>()

const POSITIONS: NotificationPosition[] = [
	'top-left',
	'top-center',
	'top-right',
	'bottom-left',
	'bottom-center',
	'bottom-right',
]

const { notifications } = useNotifications()
const hoveredId = ref<string | null>(null)

const grouped = computed(() => {
	const acc = Object.fromEntries(
		POSITIONS.map(p => [p, [] as NotificationData[]]),
	) as Record<NotificationPosition, NotificationData[]>

	for (const n of notifications.value)
		acc[n.position ?? position].push(n)

	return acc
})

function isPaused(id: string): boolean {
	if (pauseOnHover === 'all')
		return hoveredId.value !== null

	return hoveredId.value === id
}

function transitionName(position: NotificationPosition): string {
	if (position.startsWith('top'))
		return 'slide-down'

	return 'slide-up'
}

const style = useVarsResolver<ProviderVars>(() => ({
	root: {
		'--notifications-z-index': String(zIndex),
		'--notifications-width': typeof containerWidth === 'number'
			? `${containerWidth}px`
			: containerWidth,
		'--transition-duration': `${transitionDuration}ms`,
	},
}))

const viewportRefs = useTemplateRef<HTMLElement[]>('viewports')

function showPopovers() {
	for (const el of viewportRefs.value ?? []) {
		if (el && 'showPopover' in el && !el.matches(':popover-open')) {
			try {
				el.showPopover()
			}
			catch {
				// Already shown or unsupported; ignore.
			}
		}
	}
}

onMounted(() => {
	$notifications.updateState({
		limit,
		defaultPosition: position,
	})
	showPopovers()
})

watch(() => limit, limit => $notifications.updateState({ limit }))
watch(() => position, position => $notifications.updateState({ defaultPosition: position }))
</script>

<template>
	<div
		v-for='viewportPosition in POSITIONS'
		:key='viewportPosition'
		ref='viewports'
		popover='manual'
		role='region'
		aria-label='Notifications'
		aria-live='polite'
		aria-atomic='false'
		:data-position='viewportPosition'
		:class='[$style.viewport, classes?.root]'
		:style='style.root'
	>
		<TransitionGroup :name='transitionName(viewportPosition)'>
			<NotificationContainer
				v-for='n in grouped[viewportPosition]'
				:key='n.id'
				:data='n'
				:auto-close
				:paused='isPaused(n.id)'
				:class='classes?.notification'
				@hide='$notifications.hide($event)'
				@hover-start='hoveredId = n.id'
				@hover-end='hoveredId = null'
			/>
		</TransitionGroup>
	</div>
</template>

<style module>
.viewport {
	position: fixed;

	z-index: var(--notifications-z-index);
	inset: auto;

	overflow: visible;

	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);

	width: var(--notifications-width);
	max-width: 100%;
	margin: 0;
	padding: var(--spacing-md);
	border: 0;

	background: transparent;

	&[data-position='top-left'] {
		top: 0;
		left: 0;
	}

	&[data-position='top-center'] {
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	&[data-position='top-right'] {
		top: 0;
		right: 0;
	}

	&[data-position='bottom-left'] {
		bottom: 0;
		left: 0;

		flex-direction: column-reverse;
	}

	&[data-position='bottom-center'] {
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);

		flex-direction: column-reverse;
	}

	&[data-position='bottom-right'] {
		right: 0;
		bottom: 0;

		flex-direction: column-reverse;
	}

	&:not(:popover-open) {
		display: none;
	}
}
</style>
