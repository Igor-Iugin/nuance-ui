<script setup lang='ts'>
export type TransitionName
	= | 'fade'
		| 'fade-down'
		| 'fade-up'
		| 'fade-left'
		| 'fade-right'
		| 'skew-up'
		| 'skew-down'
		| 'rotate-right'
		| 'rotate-left'
		| 'slide-down'
		| 'slide-up'
		| 'slide-right'
		| 'slide-left'
		| 'scale-y'
		| 'scale-x'
		| 'scale'
		| 'pop'
		| 'pop-top-left'
		| 'pop-top-right'
		| 'pop-bottom-left'
		| 'pop-bottom-right'

export interface TransitionProps {
	name?: TransitionName
	/** Transition duration in ms, `250` default */
	duration?: number
	/** Transition dilay in ms, `0` default */
	delay?: number
}

const {
	name = 'pop-bottom-left',
	duration = 250,
	delay,
} = defineProps<TransitionProps>()

const emit = defineEmits<{
	afterLeave: []
}>()

const style = computed(() => ({
	'--transition-duration': `${duration}ms`,
	'--transition-delay': delay ? `${delay}ms` : undefined,
}))
</script>

<template>
	<Transition :class='$style.root' :style :name @after-leave='() => emit("afterLeave")'>
		<slot />
	</Transition>
</template>

<style module>
.root {
	--transition-delay: 0ms;
	--transition-duration: 250ms;
}
</style>

<style>
/* === FADE === */
.fade-enter-active, .fade-leave-active {
	transition: opacity var(--transition-duration) var(--transition-delay) ease;
}

.fade-enter-from, .fade-leave-to {
	opacity: 0;
}

/* === FADE UP === */
.fade-up-enter-active, .fade-up-leave-active {
	transform: translateY(0);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.fade-up-enter-from, .fade-up-leave-to {
	transform: translateY(30px);

	opacity: 0;
}

/* === FADE DOWN === */
.fade-down-enter-active, .fade-down-leave-active {
	transform: translateY(0);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.fade-down-enter-from, .fade-down-leave-to {
	transform: translateY(-30px);

	opacity: 0;
}

/* === FADE LEFT === */
.fade-left-enter-active, .fade-left-leave-active {
	transform: translateX(0);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.fade-left-enter-from, .fade-left-leave-to {
	transform: translateX(30px);

	opacity: 0;
}

/* === FADE RIGHT === */
.fade-right-enter-active, .fade-right-leave-active {
	transform: translateX(0);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.fade-right-enter-from, .fade-right-leave-to {
	transform: translateX(-30px);

	opacity: 0;
}

/* === SCALE === */
.scale-enter-active, .scale-leave-active {
	transform-origin: top;
	transform: scale(1);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.scale-enter-from, .scale-leave-to {
	transform: scale(0);

	opacity: 0;
}

/* === SCALE-Y === */
.scale-y-enter-active, .scale-y-leave-active {
	transform-origin: top;
	transform: scaleY(1);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.scale-y-enter-from, .scale-y-leave-to {
	transform: scaleY(0);

	opacity: 0;
}

/* === SCALE-X === */
.scale-x-enter-active, .scale-x-leave-active {
	transform-origin: top;
	transform: scaleX(1);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.scale-x-enter-from, .scale-x-leave-to {
	transform: scaleX(0);

	opacity: 0;
}

/* === SKEW-UP === */
.skew-up-enter-active, .skew-up-leave-active {
	transform-origin: top;
	transform: translateY(0) skew(0deg, 0deg);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.skew-up-enter-from, .skew-up-leave-to {
	transform: translateY(-20px) skew(-10deg, -5deg);

	opacity: 0;
}

/* === SKEW-DOWN === */
.skew-down-enter-active, .skew-down-leave-active {
	transform-origin: bottom;
	transform: translateY(0) skew(0deg, 0deg);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.skew-down-enter-from, .skew-down-leave-to {
	transform: translateY(20px) skew(-10deg, -5deg);

	opacity: 0;
}

/* === ROTATE-LEFT === */
.rotate-left-enter-active, .rotate-left-leave-active {
	transform-origin: bottom;
	transform: translateY(0) rotate(0deg);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.rotate-left-enter-from, .rotate-left-leave-to {
	transform: translateY(20px) rotate(-5deg);

	opacity: 0;
}

/* === ROTATE-RIGHT === */
.rotate-right-enter-active, .rotate-right-leave-active {
	transform-origin: bottom;
	transform: translateY(0) rotate(0deg);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.rotate-right-enter-from, .rotate-right-leave-to {
	transform: translateY(20px) rotate(5deg);

	opacity: 0;
}

/* === SLIDE-DOWN === */
.slide-down-enter-active, .slide-down-leave-active {
	transform-origin: top;
	transform: translateY(0);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.slide-down-enter-from, .slide-down-leave-to {
	transform: translateY(-100%);

	opacity: 0;
}

/* === SLIDE-UP === */
.slide-up-enter-active, .slide-up-leave-active {
	transform-origin: top;
	transform: translateY(0);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.slide-up-enter-from, .slide-up-leave-to {
	transform: translateY(100%);

	opacity: 0;
}

/* === SLIDE-LEFT === */
.slide-left-enter-active, .slide-left-leave-active {
	transform-origin: top;
	transform: translateX(0);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.slide-left-enter-from, .slide-left-leave-to {
	transform: translateX(100%);

	opacity: 0;
}

/* === SLIDE-RIGHT === */
.slide-right-enter-active, .slide-right-leave-active {
	transform-origin: top;
	transform: translateX(0);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.slide-right-enter-from, .slide-right-leave-to {
	transform: translateX(-100%);

	opacity: 0;
}

/* === POP === */
.pop-enter-active, .pop-leave-active {
	transform-origin: center center;
	transform: scale(1);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.pop-enter-from, .pop-leave-to {
	transform-origin: center center;
	transform: scale(.9) translateY(10px);

	opacity: 0;
}

/* === POP-BOTTOM-LEFT === */
.pop-bottom-left-enter-active, .pop-bottom-left-leave-active {
	transform-origin: bottom left;
	transform: scale(1);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.pop-bottom-left-enter-from, .pop-bottom-left-leave-to {
	transform-origin: bottom left;
	transform: scale(.9) translateY(10px);

	opacity: 0;
}

/* === POP-BOTTOM-RIGHT === */
.pop-bottom-right-enter-active, .pop-bottom-right-leave-active {
	transform-origin: bottom right;
	transform: scale(1);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.pop-bottom-right-enter-from, .pop-bottom-right-leave-to {
	transform-origin: bottom right;
	transform: scale(.9) translateY(10px);

	opacity: 0;
}

/* === POP-TOP-LEFT === */
.pop-top-left-enter-active, .pop-top-left-leave-active {
	transform-origin: top left;
	transform: scale(1);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.pop-top-left-enter-from, .pop-top-left-leave-to {
	transform-origin: top left;
	transform: scale(.9) translateY(-10px);

	opacity: 0;
}

/* === POP-TOP-RIGHT === */
.pop-top-right-enter-active, .pop-top-right-leave-active {
	transform-origin: top right;
	transform: scale(1);

	transition: opacity var(--transition-duration) var(--transition-delay) ease,
	transform var(--transition-duration) ease;
}

.pop-top-right-enter-from, .pop-top-right-leave-to {
	transform-origin: top right;
	transform: scale(.9) translateY(-10px);

	opacity: 0;
}
</style>
