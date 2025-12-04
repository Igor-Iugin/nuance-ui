<script setup lang='ts'>
import { computed } from 'vue'

import Renderless from '../renderless/renderless.vue'
import { useRovingFocus } from './_lib'


const { focus, focusElement, orientation, attr } = useRovingFocus()

const isVertical = computed(() => orientation === 'vertical' || orientation === 'both')
const isHorizontal = computed(() => orientation === 'horizontal' || orientation === 'both')

const attrs = computed(() => ({ [attr]: '' }))
</script>

<template>
	<Renderless
		v-bind='attrs'
		:tabindex='-1'
		@keydown.up.prevent='isVertical && focus("prev", $event.currentTarget)'
		@keydown.down.prevent='isVertical && focus("next", $event.currentTarget)'
		@keydown.left.prevent='isHorizontal && focus("prev", $event.currentTarget)'
		@keydown.right.prevent='isHorizontal && focus("next", $event.currentTarget)'
		@keydown.home.prevent='focus("first")'
		@keydown.end.prevent='focus("last")'
		@click.prevent='focusElement($event.currentTarget)'
	>
		<slot />
	</Renderless>
</template>
