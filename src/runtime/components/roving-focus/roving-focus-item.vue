<script setup lang='ts'>
import { computed } from 'vue'

import Renderless from '../renderless/renderless.vue'
import { useRovingFocus } from './_lib'


const { focus, orientation, attr } = useRovingFocus()

const isVertical = computed(() => orientation === 'vertical' || orientation === 'both')
const isHorizontal = computed(() => orientation === 'horizontal' || orientation === 'both')

const attrs = computed(() => ({ [attr]: '' }))
</script>

<template>
	<Renderless
		v-bind='attrs'
		:tabindex='-1'
		@keydown.up.prevent='isVertical && focus("prev", $event.target)'
		@keydown.down.prevent='isVertical && focus("next", $event.target)'
		@keydown.left.prevent='isHorizontal && focus("prev", $event.target)'
		@keydown.right.prevent='isHorizontal && focus("next", $event.target)'
		@keydown.home.prevent='focus("first")'
		@keydown.end.prevent='focus("last")'
	>
		<slot />
	</Renderless>
</template>
