<script setup lang='ts'>
import { addMonth } from '@formkit/tempo'


const date = ref(new Date())
</script>

<template>
	<NMonthLevel
		v-model:date='date'
		@prev='date = addMonth(date, -1)'
		@next='date = addMonth(date, 1)'
	/>
	<NMonthLevelsGroup
		v-model:date='date'
		:number-of-columns='3'
		@prev='date = addMonth(date, -1)'
		@next='date = addMonth(date, 1)'
	/>
</template>
