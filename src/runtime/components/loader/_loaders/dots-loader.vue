<template>
	<span :class='$style.root'>
		<span :class='$style.dot' />
		<span :class='$style.dot' />
		<span :class='$style.dot' />
	</span>
</template>

<style module>
.root {
	position: relative;

	display: flex;
	gap: calc(var(--loader-size) / 10);
	align-items: center;
	justify-content: center;

	width: var(--loader-size);
	height: var(--loader-size);
}

.dot {
	width: calc(var(--loader-size) / 3 - var(--loader-size) / 15);
	height: calc(var(--loader-size) / 3 - var(--loader-size) / 15);
	border-radius: 50%;

	background: var(--loader-color);

	animation: loader-dots-animation 0.8s infinite linear;

	&:nth-child(2) {
		animation-delay: 0.4s;
	}
}

@keyframes loader-dots-animation {
	0%,
	100% {
		transform: scale(1);

		opacity: 1;
	}

	50% {
		transform: scale(0.6);

		opacity: 0.5;
	}
}
</style>
