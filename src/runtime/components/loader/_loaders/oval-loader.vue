<template>
	<span :class='$style.root' />
</template>

<style module>
.root {
	display: inline-block;

	width: var(--loader-size);
	height: var(--loader-size);

	&::after {
		content: '';

		display: block;

		width: var(--loader-size);
		height: var(--loader-size);

		border-color: var(--loader-color) var(--loader-color) var(--loader-color) transparent;
		border-style: solid;
		border-width: calc(var(--loader-size) / 6);
		border-radius: 10000px;

		animation: oval-loader-animation 1.2s linear infinite;
	}
}


@keyframes oval-loader-animation {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
