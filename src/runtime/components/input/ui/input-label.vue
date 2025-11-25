<script setup lang='ts'>
import type { UiKitSize } from '@types'

import { getFontSize } from '@utils'
import { computed } from 'vue'


export interface InputLabelProps {
	required?: boolean
	size?: UiKitSize | string
}

const {
	required = false,
	size = 'sm',
} = defineProps<InputLabelProps>()

const style = computed(() => ({
	'--input-label-size': getFontSize(size),
	'--input-asterisk-color': undefined,
}))
</script>

<template>
	<label :style :class='$style.root'>
		<slot />
		<span v-if='required' :class='$style.required'> *</span>
	</label>
</template>

<style module>
.root {
	--input-label-size: var(--font-size-sm);
	--input-asterisk-color: var(--color-error);

	cursor: default;

	display: inline-block;

	font-size: var(--input-label-size);
	font-weight: 500;
	word-break: normal;
	overflow-wrap: anywhere;
	-webkit-tap-highlight-color: transparent;
}

.required {
	color: var(--input-asterisk-color);
}
</style>
