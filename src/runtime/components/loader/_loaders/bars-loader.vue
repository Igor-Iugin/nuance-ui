<template>
	<span :class='$style.root'>
		<span :class='$style.bar' />
		<span :class='$style.bar' />
		<span :class='$style.bar' />
	</span>
</template>

<style module>
.root {
	position: relative;

	display: flex;
	gap: calc(var(--loader-size) / 5);

	width: var(--loader-size);
	height: var(--loader-size);
}

.bar {
	flex: 1;

	border-radius: 2px;

	background: var(--loader-color);

	animation: bars-loader-animation 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;

	&:nth-of-type(1) {
		animation-delay: -240ms;
	}

	&:nth-of-type(2) {
		animation-delay: -120ms;
	}

	&:nth-of-type(3) {
		animation-delay: 0ms;
	}
}

@keyframes bars-loader-animation {
	0% {
		transform: scale(0.6);

		opacity: 0;
	}

	50%,
	100% {
		transform: scale(1);
	}
}
</style>
