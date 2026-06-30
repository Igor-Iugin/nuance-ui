<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { NotificationData } from './types'

import Notification from '../components/notification.vue'
import Progress from '../components/progress/progress.vue'
import { getAutoClose } from './lib'


// ─── Props & Emits ───

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

// ─── Timer State ───

const duration = getAutoClose(props.autoClose, props.data.autoClose)
const total = typeof duration === 'number' ? duration : 0
const hasProgress = total > 0

const remaining = ref<number>(total)
const progressValue = computed(() => total > 0
	? (remaining.value / total) * 100
	: 0)

let intervalId: ReturnType<typeof setInterval> | undefined

function stop(): void {
	if (intervalId !== undefined) {
		clearInterval(intervalId)
		intervalId = undefined
	}
}

function start(): void {
	if (!hasProgress || props.paused)
		return
	stop()
	intervalId = setInterval(() => {
		remaining.value -= 16
		if (remaining.value <= 0) {
			stop()
			emit('hide', props.data.id)
		}
	}, 16)
}

// ─── Pause Watch ───

watch(() => props.paused, paused => {
	if (paused) {
		stop()
	}
	else {
		start()
	}
})

// ─── Lifecycle ───

onMounted(() => {
	props.data.onOpen?.(props.data.id)
	start()
})

onBeforeUnmount(() => {
	stop()
	props.data.onClose?.(props.data.id)
})

// ─── Hover ───

function onMouseenter(): void {
	emit('hoverStart')
}

function onMouseleave(): void {
	emit('hoverEnd')
}
</script>

<template>
	<div
		:class='$style.root'
		@mouseenter='onMouseenter'
		@mouseleave='onMouseleave'
	>
		<Notification
			v-bind='props.data'
			@close="emit('hide', props.data.id)"
		/>
		<Progress
			v-if='hasProgress'
			:model-value='progressValue'
			:color='props.data.color'
			size='sm'
			:class='$style.progress'
		/>
	</div>
</template>

<style module>
.root {
	position: relative;
}

.progress {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
}
</style>
