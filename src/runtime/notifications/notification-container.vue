<script lang="ts" setup>
import { onBeforeUnmount, onMounted, toRef } from 'vue'

import type { NotificationData } from './types'

import Notification from '../components/notification.vue'
import { useCountdown } from '../composables'
import { getAutoClose } from './lib'


const props = defineProps<{
	/** Notification data object */
	data: NotificationData
	/** Global auto-close duration in ms, or false to disable */
	autoClose: number | false
	/** Whether the timer is currently paused */
	paused: boolean
}>()

const emit = defineEmits<{
	/** Emitted when the auto-close timer fires or the close button is clicked */
	hide: [id: string]
	/** Emitted on mouseenter */
	hoverStart: []
	/** Emitted on mouseleave */
	hoverEnd: []
}>()

const duration = getAutoClose(props.autoClose, props.data.autoClose)

const { progress } = useCountdown({
	duration: typeof duration === 'number' ? duration : 0,
	paused: toRef(props, 'paused'),
	onComplete: () => emit('hide', props.data.id),
})

onMounted(() => {
	props.data.onOpen?.(props.data.id)
})

onBeforeUnmount(() => {
	props.data.onClose?.(props.data.id)
})
</script>

<template>
	<Notification
		v-bind='props.data'
		v-model:progress='progress'
		:with-progress='props.data.withProgress && !!duration'
		@close="emit('hide', props.data.id)"
		@mouseenter='$emit("hoverStart")'
		@mouseleave='$emit("hoverEnd")'
	/>
</template>
